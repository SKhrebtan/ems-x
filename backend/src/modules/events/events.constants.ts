export const EVENTS_ROUTES = {
	BASE:     'events',
	GET_ONE:  ':id',
	SIMILAR:  ':id/similar',
	UPDATE:   ':id',
	DELETE:   ':id',
} as const

export const EVENTS_SWAGGER_TAG = 'events'

export const SIMILAR_THROTTLE = {
	limit: 20,
	ttl:   60_000,
} as const

export const EVENTS_SWAGGER = {
	CREATE: {
		operation: {
			summary:     'Create a new event',
			description:
				'Validates the payload via class-validator and persists a new event row. ' +
				'Returns the full record including the auto-generated id and timestamps.',
		},
		responses: {
			created: {
				status:      201,
				description: 'Event created.',
			},
			badRequest: {
				status:      400,
				description: 'Validation failed — one or more fields are missing or invalid.',
			},
		},
	},
	LIST: {
		operation: {
			summary:     'List events',
			description:
				'Returns a paginated, filterable, sortable list of events. ' +
				'`search` matches title and location (case-insensitive). ' +
				'`from`/`to` bound the event date inclusively. ' +
				'Indexed on `category` and `date` for fast filter paths.',
		},
		responses: {
			ok: {
				status:      200,
				description: 'Paginated event collection with `data`, `total`, `page`, `pageSize`, `totalPages`.',
			},
		},
	},
	GET_ONE: {
		operation: { summary: 'Get an event by id', },
		responses: {
			ok:       { status: 200, description: 'Event found.', },
			notFound: { status: 404, description: 'No event with the given id.', },
		},
	},
	SIMILAR: {
		operation: {
			summary:     'List similar events',
			description:
				'Runs the recommendation algorithm against every other event. ' +
				'Scoring: category match (50 pts) + date proximity within 30 days (up to 30 pts) + ' +
				'haversine distance within 100 km (up to 20 pts, only if both events have coords). ' +
				'Returns the top 5 by score descending, excluding zero-scoring events.',
		},
		responses: {
			ok: {
				status:      200,
				description: 'Array of up to 5 events, each annotated with a `similarityScore` field (0–100).',
			},
			notFound: { status: 404, description: 'No event with the given id.', },
		},
	},
	UPDATE: {
		operation: {
			summary:     'Update an event',
			description: 'Partial update — only the supplied fields are touched. Returns the full updated record.',
		},
		responses: {
			ok:         { status: 200, description: 'Event updated.', },
			badRequest: { status: 400, description: 'Validation failed.', },
			notFound:   { status: 404, description: 'No event with the given id.', },
		},
	},
	DELETE: {
		operation: {
			summary:     'Delete an event',
			description: 'Permanently removes the event. Returns `{ id }` of the deleted record.',
		},
		responses: {
			ok:       { status: 200, description: 'Event deleted.', },
			notFound: { status: 404, description: 'No event with the given id.', },
		},
	},
	PARAM_ID: {
		name:        'id',
		description: 'UUID of the event.',
		format:      'uuid',
	},
} as const
