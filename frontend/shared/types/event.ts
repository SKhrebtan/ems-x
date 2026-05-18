import type { EVENT_CATEGORIES } from '@/shared/constants/event-categories'

export type EventCategory = (typeof EVENT_CATEGORIES)[number]

export interface EventItem {
	id: string
	title: string
	description: string
	date: string
	location: string
	latitude: number | null
	longitude: number | null
	category: EventCategory
	createdAt: string
	updatedAt: string
}

export interface ScoredEvent extends EventItem {
	similarityScore: number
}

export interface PaginatedEvents {
	data: EventItem[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}

export interface EventInput {
	title: string
	description: string
	date: string
	location: string
	latitude?: number | null
	longitude?: number | null
	category: EventCategory
}

export interface ListEventsParams {
	category?: string
	from?: string
	to?: string
	search?: string
	sortBy?: 'date' | 'createdAt' | 'title'
	order?: 'asc' | 'desc'
	page?: number
	pageSize?: number
}
