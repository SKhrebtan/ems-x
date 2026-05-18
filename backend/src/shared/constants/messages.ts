export const MESSAGES = {
	ERROR: {
		EVENT_NOT_FOUND:        (id: string,) => `Event with id ${id} was not found.`,
		EVENT_CREATE_FAILED:    'Failed to create event.',
		EVENT_UPDATE_FAILED:    'Failed to update event.',
		EVENT_DELETE_FAILED:    'Failed to delete event.',
		EVENTS_FETCH_FAILED:    'Failed to fetch events.',
		SIMILAR_FETCH_FAILED:   'Failed to fetch similar events.',
		MISSING_ENV_VARS:       (vars: string[],) =>
			`Missing required environment variables: ${vars.join(', ',)}. Check your .env file.`,
		UNEXPECTED:             'An unexpected error occurred.',
		VALIDATION_FAILED:      'Validation failed.',
	},
	SUCCESS: {
		EVENT_CREATED:          'Event created successfully.',
		EVENT_UPDATED:          'Event updated successfully.',
		EVENT_DELETED:          'Event deleted successfully.',
	},
} as const
