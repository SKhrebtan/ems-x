import { z } from 'zod'
import { EVENT_CATEGORIES } from '@/shared/constants/event-categories'
import type { EventInput } from '@/shared/types/event'

interface BuildSchemaOpts {
	minDate?: Date
}

export const buildEventFormSchema = (opts: BuildSchemaOpts = {}) => {
	return z.object({
		title: z
			.string()
			.trim()
			.min(3, 'Title must be at least 3 characters.',)
			.max(200, 'Title is too long.',),
		description: z
			.string()
			.trim()
			.min(10, 'Description must be at least 10 characters.',)
			.max(5000, 'Description is too long.',),
		date: z
			.string()
			.refine((v) => !Number.isNaN(Date.parse(v,),), 'Provide a valid date.',)
			.refine(
				(v) => !opts.minDate || new Date(v,).getTime() >= opts.minDate.getTime(),
				'Date must be in the future.',
			),
		location: z
			.string()
			.trim()
			.min(2, 'Location is required.',)
			.max(300, 'Location is too long.',),
		latitude: z
			.union([z.number().min(-90,).max(90,), z.nan(),],)
			.optional()
			.transform((v) => (v === undefined || Number.isNaN(v,) ? null : v),),
		longitude: z
			.union([z.number().min(-180,).max(180,), z.nan(),],)
			.optional()
			.transform((v) => (v === undefined || Number.isNaN(v,) ? null : v),),
		category: z.enum(EVENT_CATEGORIES,),
	},)
}

export type EventFormSchema = ReturnType<typeof buildEventFormSchema>
export type EventFormValues = z.input<EventFormSchema>
export type EventFormOutput = z.output<EventFormSchema>

export interface EventFormProps {
	initial?: Partial<EventFormValues>
	submitLabel: string
	loading?: boolean
	serverError?: string | null
	restrictPastDates?: boolean
	onSubmit: (values: EventInput,) => void | Promise<void>
	onCancel?: () => void
}
