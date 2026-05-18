import type { Prisma } from '@prisma/client'
import type { QueryEventsDto } from './dto/query-events.dto'

export const buildEventsWhereClause = (query: QueryEventsDto,): Prisma.EventWhereInput => {
	const where: Prisma.EventWhereInput = {}

	if (query.category) {
		where.category = query.category
	}

	if (query.from || query.to) {
		where.date = {}
		if (query.from) where.date.gte = new Date(query.from,)
		if (query.to) where.date.lte = new Date(query.to,)
	}

	if (query.search) {
		where.OR = [
			{ title:       { contains: query.search, mode: 'insensitive', }, },
			{ description: { contains: query.search, mode: 'insensitive', }, },
			{ location:    { contains: query.search, mode: 'insensitive', }, },
		]
	}

	return where
}

export const buildEventsOrderBy = (query: QueryEventsDto,): Prisma.EventOrderByWithRelationInput => {
	const sortBy = query.sortBy ?? 'date'
	const order = query.order ?? 'asc'
	return { [sortBy]: order, }
}
