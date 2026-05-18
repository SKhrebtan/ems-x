import type {
	EventInput,
	EventItem,
	ListEventsParams,
	PaginatedEvents,
	ScoredEvent,
} from '@/shared/types/event'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'

export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
		public details?: unknown,
	) {
		super(message,)
		this.name = 'ApiError'
	}
}

const request = async <T,>(path: string, init: RequestInit = {},): Promise<T> => {
	const res = await fetch(`${API_URL}${path}`, {
		...init,
		headers: {
			'Content-Type': 'application/json',
			...(init.headers ?? {}),
		},
	},)

	if (!res.ok) {
		let body: unknown
		try {
			body = await res.json()
		}
		catch {
			body = await res.text()
		}
		const raw = (body as { message?: string | string[], })?.message
		const message = Array.isArray(raw,) ? raw.join(', ',) : (raw ?? res.statusText)
		throw new ApiError(message, res.status, body,)
	}

	if (res.status === 204) return undefined as T
	return res.json() as Promise<T>
}

const buildQuery = (params: Record<string, unknown>,): string => {
	const qs = new URLSearchParams()
	for (const [key, value,] of Object.entries(params,)) {
		if (value === undefined || value === null || value === '') continue
		qs.set(key, String(value,),)
	}
	const s = qs.toString()
	return s ? `?${s}` : ''
}

export const eventsService = {
	list: (params: ListEventsParams = {},) =>
		request<PaginatedEvents>(`/events${buildQuery(params,)}`,),

	get: (id: string,) => request<EventItem>(`/events/${id}`,),

	similar: (id: string,) => request<ScoredEvent[]>(`/events/${id}/similar`,),

	create: (data: EventInput,) =>
		request<EventItem>('/events', {
			method: 'POST',
			body: JSON.stringify(data,),
		},),

	update: (id: string, data: Partial<EventInput>,) =>
		request<EventItem>(`/events/${id}`, {
			method: 'PATCH',
			body: JSON.stringify(data,),
		},),

	remove: (id: string,) =>
		request<{ id: string, }>(`/events/${id}`, { method: 'DELETE', },),
}
