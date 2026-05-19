# Project Documentation

In-depth notes that complement [README.md](README.md). The README explains *how to run* the project; this document explains *how it's built and why*.

---

## 1. Architecture

```
┌───────────────────────┐      HTTP/JSON       ┌───────────────────────┐      SQL       ┌────────────┐
│  Next.js (App Router) │ ───────────────────▶ │  NestJS (REST API)    │ ─────────────▶ │  Postgres  │
│  Material UI v6       │ ◀─────────────────── │  Prisma · Helmet      │ ◀───────────── │            │
│  TanStack Query       │                      │  class-validator      │                │            │
│  Zustand (persist)    │                      │  ThrottlerGuard       │                │            │
│  React Hook Form+Zod  │                      │  AllExceptionsFilter  │                │            │
└───────────────────────┘                      │  Swagger /api/docs    │                └────────────┘
        :3000                                  └───────────────────────┘
                                                         :8080
```

**Frontend** — Next.js App Router with Material UI v6 for the design system, TanStack Query for server state, Zustand (with `persist` middleware) for client-only state that needs to survive a reload (theme), and React Hook Form + Zod for the create/edit form. The map is Leaflet + OpenStreetMap (no API key, free tiles).

**Backend** — NestJS exposing a REST API. Prisma is the ORM, Postgres the store. The full NestJS request lifecycle is wired:
- **Pipe** — global `ValidationPipe` with class-validator DTOs validates and transforms inbound payloads
- **Guard** — global `ThrottlerGuard` (100 req/min per IP), stricter `@Throttle` on `/similar` (20 req/min)
- **Interceptor** — `LoggerInterceptor` logs method/URL/status/latency on every request
- **Filter** — `AllExceptionsFilter` normalizes every thrown exception into a consistent JSON shape

`helmet` adds standard security headers, CORS is allow-listed from `FRONTEND_URL`. Swagger is auto-generated from decorators and served at `/api/docs`.

**Database** — single `events` table (see [backend/prisma/schema.prisma](backend/prisma/schema.prisma)). The schema is small enough that there's no separate ER diagram — one entity, no relations. Indexed on `category` and `date` to keep the list-and-filter path cheap.

### Why this stack?

- **Next.js App Router** — co-locates routes, layouts, and route-level data fetching; server components remove the need for a separate "is this isomorphic" decision tree. Familiar to any modern React dev.
- **NestJS** — opinionated module system maps cleanly to features (`modules/events/`, `modules/recommendations/`), DTOs + decorators give one place to define API contracts, and the request lifecycle (pipes → interceptors → guards → filter) is well-documented.
- **Prisma over TypeORM** — schema-first DX, type-safe client, painless migrations. Beats writing decorators on entity classes when the model is this simple.
- **Postgres** — well-supported by Prisma, gives us indexes/JSON/full-text if the project grows.
- **TanStack Query** — caches, dedupes, and invalidates on its own; eliminates ~80% of the manual `useEffect + useState` plumbing that "vanilla" React data fetching needs.
- **Material UI v6** — first-class CSS-variables support (`extendTheme` → `createTheme` with `cssVariables`), light/dark switching via a single `data-mui-color-scheme` attribute, themeable without rewriting components.

### Folder structure (top-level)

```
frontend/
├── app/                    # Next.js routes only (layouts, pages, route-level providers)
├── shared/
│   ├── components/         # Per-component folders (navbar/, event-card/, …)
│   ├── constants/          # EVENT_CATEGORIES, CATEGORY_LABELS, QUERY_KEYS
│   ├── hooks/              # use-events, use-debounce
│   ├── services/           # events.service (typed fetch wrapper)
│   ├── styles/             # theme.ts + globals.css (CSS variables)
│   ├── types/              # Event interfaces
│   └── utils/              # date-formatter
└── store/                  # Zustand stores (use-theme-store)

backend/src/
├── app.module.ts                       # ThrottlerModule + ThrottlerGuard via APP_GUARD
├── main.ts                             # checkEnv → helmet → CORS → pipes/filters/interceptors → Swagger
├── env.ts                              # checkEnv() — fail-fast env validation (+ dotenv side-effect)
├── modules/
│   ├── events/
│   │   ├── dto/                        # Create/Update/Query DTOs with @ApiProperty
│   │   ├── events.controller.ts        # routes from EVENTS_ROUTES, swagger from EVENTS_SWAGGER
│   │   ├── events.service.ts           # public/private, try/catch, MESSAGES.ERROR.*
│   │   ├── events.module.ts
│   │   ├── events.types.ts             # PaginatedEvents, DeleteEventResult
│   │   ├── events.constants.ts         # EVENTS_ROUTES, EVENTS_SWAGGER, SIMILAR_THROTTLE
│   │   └── events.utils.ts             # buildEventsWhereClause, buildEventsOrderBy
│   └── recommendations/
│       ├── recommendations.constants.ts # RECOMMENDATION_CONFIG (weights + horizons)
│       ├── recommendations.utils.ts    # pure: haversineKm + scoreSimilarity
│       ├── recommendations.service.ts
│       ├── recommendations.module.ts
│       └── recommendations.types.ts    # ScoredEvent
└── shared/
    ├── constants/                      # messages.ts (single source for all strings)
    ├── utils/                          # AllExceptionsFilter (exception-filter.util.ts)
    ├── interceptors/                   # LoggerInterceptor (request logging)
    └── types/  guards/  decorators/   # placeholders for future cross-cutting code
```

### Theme: a single source of truth

Colors aren't hard-coded in the MUI theme. They live as CSS custom properties in [frontend/shared/styles/globals.css](frontend/shared/styles/globals.css):

```css
:root {
  --color-primary: #3949ab;
  --color-primary-channel: 57 73 171;   /* for translucent variants */
  /* ... */
}
[data-mui-color-scheme='dark'] {
  --color-primary: #7986cb;
  /* ... */
}
```

The theme references them via `var(--color-...)` so palette changes are a one-file edit. The `*Channel` tuples are what MUI needs to compute `rgba(...)`-style derivatives (`alphaOf(theme.palette.primary.main, 0.04)` etc.).

### Theme toggle flow

1. User clicks the icon → Zustand `toggleMode` flips `mode` in [store/use-theme-store.ts](frontend/store/use-theme-store.ts)
2. `persist` middleware writes `{ state: { mode } }` to `localStorage` under `ems-theme`
3. `ThemeToggle` re-renders, `useEffect` calls MUI's `setMode(mode)` from `useColorScheme()`
4. MUI flips `data-mui-color-scheme="dark"` on `<html>` (configured via `cssVariables.colorSchemeSelector`)
5. CSS vars under `[data-mui-color-scheme='dark']` win the cascade — every component re-paints without a React render

---

## 2. Recommendation algorithm

> Spec: *"Create a basic algorithm for recommending similar events based on attributes like category, date, or location."*

For a given target event, every other event is scored on three independent signals. The final score is a weighted sum in the range **0–100**. Zero-scoring events are dropped; the rest are returned in descending order, capped at 5.

### Formula

```
score(target, candidate) =
    50 · 1[same category]
  + 30 · max(0, 1 − daysApart / 30)
  + 20 · max(0, 1 − km        / 100)   ← only if both have coords
```

| Signal | Weight | Decay |
|---|---:|---|
| Category match | **50** | Step function — exact match or 0 |
| Date proximity | **30** | Linear over a 30-day horizon |
| Location proximity | **20** | Linear over a 100 km horizon (haversine) |

All knobs live in one object — [backend/src/modules/recommendations/recommendations.constants.ts](backend/src/modules/recommendations/recommendations.constants.ts):

```ts
export const RECOMMENDATION_CONFIG = {
  weights: { category: 50, date: 30, location: 20 },
  horizons: { dateDays: 30, locationKm: 100 },
  earthRadiusKm: 6371,
  defaultLimit: 5,
} as const
```

### Worked example

Using two events from [backend/prisma/seed.ts](backend/prisma/seed.ts):

**Target**: *Dublin Tech Summit 2026* — `CONFERENCE`, 2026-06-15, Dublin (53.3478, −6.2418)
**Candidate**: *Belfast AI Conference* — `CONFERENCE`, 2026-06-12, Belfast (54.5996, −5.9197)

| Signal | Computation | Points |
|---|---|---:|
| Category | both `CONFERENCE` → +50 | 50.00 |
| Date | \|2026-06-15 − 2026-06-12\| = 3 days · 30 · (1 − 3/30) | 27.00 |
| Location | haversine ≈ 140 km, beyond 100 km horizon → 0 | 0.00 |
| **Total** | | **77.00** |

A full ranking for the same target across seeded data:

| Candidate | Category | Δdays | Δkm | Score |
|---|---|---:|---:|---:|
| Belfast AI Conference | CONFERENCE ✓ | 3 | 140 | 77.0 |
| NextJS & React Workshop | WORKSHOP ✗ | 7 | 0.5 | 43.0 |
| TypeScript Patterns Workshop | WORKSHOP ✗ | 14 | 0.7 | 36.0 |
| Cork Startup Pitch Night | MEETUP ✗ | 3 | 220 | 27.0 |
| Galway Indie Game Devs Meetup | MEETUP ✗ | 10 | 190 | 20.0 |

Belfast wins on category despite being far away. Dublin workshops follow via location + date proximity. Cork/Galway meetups still surface because they're date-adjacent — but they would lose to a same-category event if one existed nearby.

### Why these weights?

- **Category as the dominant signal (50)** — semantic intent of "similar" usually means "the same kind of thing". A user attending one conference is more likely interested in another conference than in a concert next door.
- **Date as second (30)** — events nearby in time fit the same "planning window". A 30-day horizon matches typical calendar planning.
- **Location as a tiebreaker (20)** — coordinates are *optional* in our schema (`latitude`, `longitude` are nullable). Weighting them too heavily would penalize events that simply lack geocoding.
- **Sum to 100** — gives a score that reads as a confidence percentage to the end user (rendered as the chip on each recommendation).

### Implementation choice: in-memory scoring

The current implementation loads every other event into memory and scores them with JS:

```ts
const candidates = await prisma.event.findMany({ where: { id: { not: eventId } } })
return candidates
  .map(e => ({ ...e, similarityScore: scoreSimilarity(target, e) }))
  .filter(e => e.similarityScore > 0)
  .sort((a, b) => b.similarityScore - a.similarityScore)
  .slice(0, limit)
```

This is fine at our scale (10–1,000 events). See *Trade-offs* below for what changes at 10k+.

---

## 3. Trade-offs / Decisions

A few non-obvious choices and what we'd revisit if scope grew.

### Request lifecycle: all four NestJS mechanisms wired

The spec asked for "validation and error handling (guards, middleware, filters)". The chosen implementation:

| Mechanism | Where | What it does | Why this and not the alternative |
|---|---|---|---|
| **Pipe** (`ValidationPipe`) | `main.ts` global | DTO validation via class-validator + transform | Rejects bad payloads at the boundary, services trust their inputs |
| **Guard** (`ThrottlerGuard`) | `app.module.ts` via `APP_GUARD` | 100 req/min/IP, 20/min on `/similar` | Picked throttling over an `ApiKeyGuard` — an API key in `NEXT_PUBLIC_*` is security theatre for a browser-fronted backend; throttling actually defends against scrapers |
| **Interceptor** (`LoggerInterceptor`) | `main.ts` global | Method/URL/status/latency on every request | Picked over a traditional `LoggerMiddleware` so all cross-cutting code lives in `shared/` with no `middleware/` folder; functionally identical here |
| **Filter** (`AllExceptionsFilter`) | `main.ts` global | Normalizes thrown errors into `{ statusCode, timestamp, path, message }`, logs stack | One place for the error shape; services throw NestJS exception classes and trust the filter |

### Why no authentication guard yet

A real EMS needs `JwtAuthGuard` + a user model. For this MVP, the spec is silent on auth, and there's no user/event ownership relation in the schema. An `ApiKeyGuard` would tick a box but be misleading — see *security theatre* above. The path when we want it: add a `User` model, `@nestjs/passport` + `@nestjs/jwt`, swap the global guard to a chain (`JwtAuthGuard` + `ThrottlerGuard`), mark public endpoints with `@Public()`.

### In-memory scoring instead of SQL

**Choice**: Load all events, score in Node.
**Why now**: Trivially simple, the algorithm is pure and unit-testable, no Prisma raw-query escape hatches needed. At 100 events × constant-time scoring per pair, the whole endpoint is sub-millisecond.
**When to revisit**: Past ~10k events, the full-table scan starts to hurt. The fix is to push the cheap filters into the SQL query first:

```ts
prisma.event.findMany({
  where: {
    id: { not: target.id },
    OR: [
      { category: target.category },                                          // category match
      { date: { gte: subDays(target.date, 30), lte: addDays(target.date, 30) } }, // date window
      // location window would need PostGIS or a bounding-box approximation
    ],
  },
})
```

That cuts the candidate set by a factor of 10–100 before scoring. The scoring itself can still happen in Node.

### Theme persistence: Zustand instead of MUI's built-in

**Choice**: Zustand `persist` writes `{ state: { mode } }` to `localStorage`; a `useEffect` then pushes the value into MUI's `useColorScheme`.
**Why**: One source of truth for client state. Zustand also gets us state for *any* other persisted preference (filter presets, sidebar collapsed, recently-viewed events) without adding another mechanism.
**Cost**: A brief flash of light theme on first paint before React hydrates and the effect fires. Mitigatable with an inline `<head>` bootstrap script reading the same localStorage key — intentionally skipped to keep `layout.tsx` clean.

### Reverse-geocoding via Nominatim (no API key)

**Choice**: When you click the map in the create form, we call OpenStreetMap's free Nominatim endpoint to fetch a human-readable address.
**Why**: Zero setup, no signup, no key in env.
**Cost**: Rate-limited to ~1 req/sec per IP. Fine for clicks; would not work for auto-firing on map-drag. The fallback (user types the address manually) is always there.

### Validation lives at the boundary, not in the service

**Choice**: `class-validator` decorators on DTOs + global `ValidationPipe`. Service code assumes valid input.
**Why**: One layer to think about. Service code stays readable. Mismatched/missing fields are rejected with a 400 before they reach business logic.
**Cost**: We can't enforce *cross-field* rules in the DTO easily (e.g., "if `latitude` is set, `longitude` must also be set"). For this project there are no such rules, so it's a non-issue.

### CORS via named env vars

**Choice**: One env var per allowed origin (`FRONTEND_URL`, room for `ADMIN_URL` later) instead of a comma-split `CORS_ORIGIN` list.
**Why**: Self-documenting — adding a new consumer is a single named variable.

### Folder structure: kind-folders, not type-folders

**Choice**: `shared/{components,hooks,services,types,utils,constants,styles}` plus `store/` for Zustand. Each component owns its folder with sibling `.styles.ts`, `.types.ts`, `.utils.ts`.
**Why**: Locating code by *what it is* (a hook, a service) is faster than by *what feature it serves* at this size. When a feature grows, its module folder (e.g. `modules/events/`) keeps everything that's not reusable. This is the same structure on the user's other projects, so context-switching cost is zero.

---

## 4. What I'd add next

Roughly ordered by impact.

1. **Authentication & per-user data** — currently anyone can CRUD any event. A real EMS needs at minimum: account, owner-of-event, "events I'm attending", role-based admin actions. NestJS Passport + JWT is the obvious path; the existing `AllExceptionsFilter` already handles `UnauthorizedException` correctly.
2. **Full-text search** — the current `search` query uses Prisma's `contains` (case-insensitive `ILIKE`). For thousands of events with typo tolerance and ranking, switch to Postgres `tsvector` + GIN index, or add a search service (Meilisearch / Typesense).
3. **Recommendation cache** — `findSimilar` recomputes on every request. For a heavily-trafficked event detail page, cache the top-N per event (TTL ~1h) in Redis or even in the events table itself, invalidated when any neighbouring event is created/updated/deleted.
4. **Server-side rendering for SEO** — the list page is currently client-rendered with TanStack Query. Migrating to a Next.js server component + streaming would let crawlers see event content. Trade-off is losing client-side filtering until interactivity hydrates.
5. **End-to-end tests** — one Playwright spec per critical path (create → details → similar → edit → delete). Unit tests for the scoring algorithm are also missing and would be very high-value (small surface, lots of edge cases like null coords, same-day events, exact-match category).
6. **Image uploads for events** — currently events are text-only. Storage in S3-compatible bucket; signed-URL upload from the browser to bypass the API.
7. **Per-user theme + locale** — `useThemeStore` already does theme persistence cleanly; mirror the pattern for `useLocaleStore` once we have a user model. i18n via `next-intl`.
8. **Observability** — replace the home-grown `LoggerInterceptor` with structured logs (`pino`) and a tracing setup (`@opentelemetry/instrumentation-nestjs-core`). Currently a 5xx error is logged but there's no way to correlate it across services.
9. **Rate-limit tiering** — basic throttling is already in place (100/min global, 20/min on `/similar`). Next step is per-user limits (once auth lands) and a Redis-backed throttler storage so limits survive process restarts and apply across replicas. Frontend-side, Nominatim already self-rate-limits via the click-only call pattern, but a leading-edge throttle would harden it further.
10. **CI/CD** — GitHub Actions: install, lint, type-check, run migrations against a Postgres service, run tests. A separate "preview deploy" workflow on PR.
