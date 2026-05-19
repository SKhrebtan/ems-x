import type { Event } from '@prisma/client'

export interface ScoredEvent extends Event {
	similarityScore: number
}
