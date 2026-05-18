import type { Event } from '@prisma/client'

export interface PaginatedEvents {
	data: Event[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}

export interface DeleteEventResult {
	id: string
}
