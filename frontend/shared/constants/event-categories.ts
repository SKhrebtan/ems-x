import type { EventCategory } from '@/shared/types/event'

export const EVENT_CATEGORIES = [
	'CONFERENCE',
	'WORKSHOP',
	'MEETUP',
	'CONCERT',
	'SPORTS',
	'EXHIBITION',
	'OTHER',
] as const

export const CATEGORY_LABELS: Record<EventCategory, string> = {
	CONFERENCE: 'Conference',
	WORKSHOP: 'Workshop',
	MEETUP: 'Meetup',
	CONCERT: 'Concert',
	SPORTS: 'Sports',
	EXHIBITION: 'Exhibition',
	OTHER: 'Other',
}
