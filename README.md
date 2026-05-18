# Event Management System (EMS)

A full-stack EMS that demonstrates CRUD, filtering, a similarity-based recommendation algorithm, and an interactive map view.

- **Backend** — NestJS · Prisma · PostgreSQL
- **Frontend** — Next.js (App Router) · Material UI v6 (CSS variables) · TanStack Query · Zustand (persist) · React Hook Form + Zod · Leaflet + OpenStreetMap

> All seed data is synthetic. See [DOCS.md](DOCS.md) for architecture, the recommendation algorithm, trade-offs, and future work.

## Repository layout

```
project-x/
├── backend/                # NestJS API (port 8080)
├── frontend/               # Next.js UI (port 3000)
├── README.md
└── DOCS.md                 # Deeper explanations
```

## Prerequisites

- Node.js 20+
- Yarn (Berry) — `nodeLinker: node-modules` is already configured per app
- PostgreSQL 13+ running locally (the default `DATABASE_URL` assumes `postgresql://postgres:postgres@localhost:5432/ems`)

## Quick start

```bash
# 1. Backend
cd backend
yarn install
yarn prisma:generate
yarn prisma:migrate dev      # creates the schema
yarn seed                    # loads 10 demo events across Ireland
yarn start:dev               # API on http://localhost:8080/api

# 2. Frontend (in a second terminal)
cd frontend
yarn install
yarn dev                     # UI on http://localhost:3000
```

Then open:
- http://localhost:3000 — the UI
- http://localhost:8080/api/docs — interactive API docs (Swagger UI)

---

## Backend

### Setup

`backend/.env` (created with sane defaults):

```dotenv
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ems?schema=public"
PORT=8080
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

On boot, [`env.ts`](backend/src/env.ts) loads `.env` via `dotenv/config` and fails fast if any required variable is missing — no half-started server in a misconfigured state.

### Endpoints

Interactive API documentation — **Swagger UI at http://localhost:8080/api/docs** (auto-generated from controller and DTO decorators, with "Try it out" buttons on every endpoint).

| Method | Path | Purpose | Rate limit |
|---|---|---|---|
| `GET` | `/api/events` | List events (filter, sort, paginate) | 100/min |
| `POST` | `/api/events` | Create event | 100/min |
| `GET` | `/api/events/:id` | Get a single event | 100/min |
| `PATCH` | `/api/events/:id` | Update event | 100/min |
| `DELETE` | `/api/events/:id` | Delete event | 100/min |
| `GET` | `/api/events/:id/similar` | Top 5 similar events (recommendation algorithm) | **20/min** |

List query params: `category`, `from`, `to`, `search`, `sortBy` (`date` \| `createdAt` \| `title`), `order` (`asc` \| `desc`), `page`, `pageSize`.

### Cross-cutting concerns (request lifecycle)

The spec asked for "validation and error handling (guards, middleware, filters)" — every mechanism is wired:

- **Validation** — global `ValidationPipe` with `transform: true, whitelist: true`; DTOs decorated with `class-validator` + `@nestjs/swagger`. Invalid payloads are rejected with 400 before they reach business logic.
- **Guards** — global `ThrottlerGuard` (100 req/min per IP via `APP_GUARD` in [app.module.ts](backend/src/app.module.ts)); `@Throttle` override drops `/similar` to 20/min since it scans the whole table.
- **Interceptors** — `LoggerInterceptor` ([shared/interceptors/logger.interceptor.ts](backend/src/shared/interceptors/logger.interceptor.ts)) logs method, URL, status, and latency on every request. Replaces a traditional `LoggerMiddleware` for a cleaner folder structure.
- **Filters** — `AllExceptionsFilter` ([shared/utils/exception-filter.util.ts](backend/src/shared/utils/exception-filter.util.ts)) normalizes every thrown exception into `{ statusCode, timestamp, path, message }` and logs the stack.
- **Messages** — all user-facing error/success strings live in one module: [shared/constants/messages.ts](backend/src/shared/constants/messages.ts). Services use `MESSAGES.ERROR.*` keys; no inline strings.
- **Security** — `helmet` for standard headers, CORS allow-listed against `FRONTEND_URL` with `credentials: true`.

### Folder structure

```
backend/src/
├── app.module.ts                   # ThrottlerModule + ThrottlerGuard wired via APP_GUARD
├── main.ts                         # bootstrap: checkEnv → helmet → CORS → pipes/filters/interceptors → Swagger
├── env.ts                          # checkEnv() — required env validation, dotenv side-effect
├── events/
│   ├── dto/                        # CreateEventDto, UpdateEventDto, QueryEventsDto (+ @ApiProperty)
│   ├── events.controller.ts        # public methods, routes from EVENTS_ROUTES
│   ├── events.service.ts           # public/private, try/catch, MESSAGES
│   ├── events.module.ts
│   ├── events.types.ts             # PaginatedEvents, DeleteEventResult
│   ├── events.constants.ts         # EVENTS_ROUTES, EVENTS_SWAGGER, SIMILAR_THROTTLE
│   └── events.utils.ts             # buildEventsWhereClause, buildEventsOrderBy
├── recommendations/
│   ├── recommendations.constants.ts # RECOMMENDATION_CONFIG (weights + horizons)
│   ├── recommendations.utils.ts     # haversineKm + scoreSimilarity (pure)
│   ├── recommendations.service.ts   # public, try/catch, MESSAGES
│   ├── recommendations.module.ts
│   └── recommendations.types.ts     # ScoredEvent
└── shared/
    ├── constants/                  # messages.ts (single source for error/success strings)
    ├── utils/                      # exception-filter.util.ts (AllExceptionsFilter)
    ├── interceptors/               # logger.interceptor.ts (LoggerInterceptor)
    └── types/  guards/  decorators/  # placeholders for future cross-cutting code
```

### Recommendation algorithm — quick reference

Each candidate gets a score in 0–100 across three signals; top 5 are returned. Full derivation with worked examples in [DOCS.md §2](DOCS.md#2-recommendation-algorithm).

| Signal | Weight | Decay |
|---|---:|---|
| Category match | 50 | exact match or 0 |
| Date proximity | 30 | linear over 30 days |
| Location proximity | 20 | linear over 100 km (haversine) — only if both events have coords |

All tuning lives in [recommendations.constants.ts](backend/src/recommendations/recommendations.constants.ts).

---

## Frontend

### Setup

`frontend/.env`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Pages

| Route | Purpose |
|---|---|
| `/` | Event list — filter, sort, paginate, debounced search |
| `/events/new` | Create event — full form + click-to-pick map (Leaflet + Nominatim reverse-geocode) |
| `/events/[id]` | Event details + similar-events sidebar + delete confirm |
| `/events/[id]/edit` | Edit event — same form as create, without future-date restriction |
| `/map` | Leaflet map of all geo-coded events |

### Theming

Two layers:

1. **CSS custom properties** in [shared/styles/globals.css](frontend/shared/styles/globals.css) — the actual color tokens, defined once for light and overridden under `[data-mui-color-scheme='dark']`. Includes `*-channel` triplets for MUI's translucent variants.
2. **MUI theme** in [shared/styles/theme.ts](frontend/shared/styles/theme.ts) — `createTheme` with `cssVariables.colorSchemeSelector: 'data-mui-color-scheme'` and palette values like `'var(--color-primary)'`.

**Light/dark toggle** — Zustand `persist` store ([store/use-theme-store.ts](frontend/store/use-theme-store.ts)) is the source of truth; `ThemeToggle` syncs the value into MUI's `useColorScheme()` via effect. Sun (`#fbc02d`) shows in light mode, moon (`#ffffff`) in dark mode.

### Form UX

The create/edit form ([shared/components/event-form/](frontend/shared/components/event-form/)) uses React Hook Form + Zod:

- `mode: 'onTouched'` — errors appear after blur, not on first render
- `safeParse(watch())` drives `isFormValid` so the submit button is disabled when invalid
- `isDirty` is required too — the edit page won't fire a PATCH if nothing changed
- `restrictPastDates` prop (set on the create page only) wires both the HTML `min` attribute and an extra zod refinement, so past dates are unreachable in the native picker and rejected if typed
- Latitude/longitude inputs accept `,` or `.` as the decimal separator via the local `NumericInput` component
- **`LocationPicker`** ([shared/components/location-picker/](frontend/shared/components/location-picker/)) shows a Leaflet map under the form — click anywhere to drop a pin; lat/lng auto-populate and the location string is reverse-geocoded via OpenStreetMap Nominatim (free, no API key)

### Data layer

- [shared/services/events.service.ts](frontend/shared/services/events.service.ts) — typed `fetch` wrapper with custom `ApiError`
- [shared/constants/query-keys.ts](frontend/shared/constants/query-keys.ts) — `QUERY_KEYS` (single source for TanStack keys)
- [shared/hooks/use-events.ts](frontend/shared/hooks/use-events.ts) — `useGetEvents`, `useGetEventById`, `useGetSimilarEvents`, `useCreateEvent`, `useUpdateEvent`, `useDeleteEvent`
- [shared/hooks/use-debounce.ts](frontend/shared/hooks/use-debounce.ts) — 700ms debounce on the list page's search input (object-safe via JSON stringify)
- [app/query-provider.tsx](frontend/app/query-provider.tsx) — `QueryClient` exported as a module-level singleton so services can call `queryClient.invalidateQueries(...)` outside React

### Folder structure

```
frontend/
├── app/                            # Next.js routes only
│   ├── layout.tsx
│   ├── page.tsx                    # /
│   ├── providers.tsx               # ThemeProvider + QueryProvider
│   ├── query-provider.tsx          # exports `queryClient` module-level
│   ├── icon.svg                    # favicon
│   ├── events/[id]/page.tsx
│   ├── events/[id]/edit/page.tsx
│   ├── events/new/page.tsx
│   └── map/page.tsx
├── shared/
│   ├── components/
│   │   ├── navbar/                 # each folder: <name>.tsx + <name>.styles.ts + index.ts
│   │   ├── event-card/
│   │   ├── event-filters/
│   │   ├── event-form/             # + .types.ts, .utils.ts, numeric-input.tsx
│   │   ├── events-map/             # Leaflet map (dynamic-imported for SSR)
│   │   ├── similar-events/
│   │   ├── delete-confirm-dialog/
│   │   ├── location-picker/        # click-to-pick + Nominatim reverse geocode
│   │   └── theme-toggle/
│   ├── constants/                  # event-categories, query-keys
│   ├── hooks/                      # use-events, use-debounce
│   ├── services/                   # events.service
│   ├── styles/                     # theme.ts, globals.css
│   ├── types/                      # event.ts
│   └── utils/                      # date-formatter
└── store/
    └── use-theme-store.ts          # Zustand + persist
```

---

## Development conventions

A few project-wide rules; see source for examples.

- **kebab-case filenames** (`event-card.tsx`), **PascalCase exports** (`export const EventCard`).
- **Per-component folder**: `<name>.tsx` + `<name>.styles.ts` + `index.ts` (barrel); add `.types.ts` / `.utils.ts` / `.constants.ts` siblings if the component grows.
- **Trailing commas** in arrays, objects, call args, and arrow param lists. **Not** in parens wrapping a single expression — `(x,)` would be a comma operator, not a list.
- **Zustand `persist`** for any state that should survive a reload; store filenames `use-<name>-store.ts`.
- **TanStack Query hooks** have explicit `UseQueryResult<T>` / `UseMutationResult<T, E, V>` return types; keys live in `shared/constants/query-keys.ts`.
- **Components**: `interface IProps`, `React.FC<IProps>`.

---

## Further reading

- [DOCS.md](DOCS.md) — architecture, algorithm walkthrough, trade-offs, what's next.
