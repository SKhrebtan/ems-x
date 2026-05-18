'use client'
import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import { CATEGORY_LABELS, EVENT_CATEGORIES, } from '@/shared/constants/event-categories'
import type { EventCategory, EventInput } from '@/shared/types/event'
import { LocationPicker } from '@/shared/components/location-picker'
import { buildEventFormSchema, type EventFormProps, type EventFormValues } from './event-form.types'
import { nowLocalInput, toLocalInput } from './event-form.utils'
import { NumericInput } from './numeric-input'
import { styles } from './event-form.styles'

export const EventForm = ({
	initial,
	submitLabel,
	loading,
	serverError,
	restrictPastDates,
	onSubmit,
	onCancel,
}: EventFormProps,) => {
	const minDateTime = useMemo(
		() => (restrictPastDates ? nowLocalInput() : undefined),
		[restrictPastDates,],
	)
	const schema = useMemo(
		() => buildEventFormSchema({ minDate: restrictPastDates ? new Date() : undefined, },),
		[restrictPastDates,],
	)

	const { control, handleSubmit, setValue, watch, formState: { errors, isDirty, }, } = useForm<EventFormValues>({
		resolver: zodResolver(schema,),
		mode: 'onTouched',
		reValidateMode: 'onChange',
		defaultValues: {
			title: initial?.title ?? '',
			description: initial?.description ?? '',
			date: initial?.date ? toLocalInput(initial.date as string,) : '',
			location: initial?.location ?? '',
			latitude: initial?.latitude ?? undefined,
			longitude: initial?.longitude ?? undefined,
			category: (initial?.category as EventCategory) ?? 'OTHER',
		},
	},)

	const isFormValid = schema.safeParse(watch(),).success

	const submit = handleSubmit((values,) => {
		const payload: EventInput = {
			title: values.title.trim(),
			description: values.description.trim(),
			date: new Date(values.date,).toISOString(),
			location: values.location.trim(),
			latitude: values.latitude ?? null,
			longitude: values.longitude ?? null,
			category: values.category,
		}
		return onSubmit(payload,)
	},)

	return (
		<Box component='form' onSubmit={submit} sx={styles.form} noValidate>
			{serverError && <Alert severity='error'>{serverError}</Alert>}

			<Controller
				name='title'
				control={control}
				render={({ field, },) => (
					<TextField {...field} label='Title' fullWidth error={!!errors.title} helperText={errors.title?.message} />
				)}
			/>

			<Controller
				name='description'
				control={control}
				render={({ field, },) => (
					<TextField {...field} label='Description' fullWidth multiline minRows={4} error={!!errors.description} helperText={errors.description?.message} />
				)}
			/>

			<Box sx={styles.twoCol}>
				<Controller
					name='date'
					control={control}
					render={({ field, },) => (
						<TextField
							{...field}
							type='datetime-local'
							label='Date & time'
							slotProps={{
								inputLabel: { shrink: true, },
								htmlInput: minDateTime ? { min: minDateTime, } : undefined,
							}}
							error={!!errors.date}
							helperText={errors.date?.message}
						/>
					)}
				/>

				<Controller
					name='category'
					control={control}
					render={({ field, },) => (
						<TextField {...field} select label='Category' error={!!errors.category} helperText={errors.category?.message}>
							{EVENT_CATEGORIES.map((c,) => (
								<MenuItem key={c} value={c}>{CATEGORY_LABELS[c]}</MenuItem>
							),)}
						</TextField>
					)}
				/>
			</Box>

			<Controller
				name='location'
				control={control}
				render={({ field, },) => (
					<TextField {...field} label='Location' fullWidth error={!!errors.location} helperText={errors.location?.message} />
				)}
			/>

			<Box sx={styles.twoCol}>
				<NumericInput
					control={control}
					name='latitude'
					label='Latitude (optional)'
					helperText='Or click the map below — accepts , or .'
					errorMessage={errors.latitude?.message}
				/>
				<NumericInput
					control={control}
					name='longitude'
					label='Longitude (optional)'
					errorMessage={errors.longitude?.message}
				/>
			</Box>

			<LocationPicker
				latitude={watch('latitude',) as number | null | undefined}
				longitude={watch('longitude',) as number | null | undefined}
				onPick={(lat, lng, address,) => {
					setValue('latitude', lat, { shouldValidate: true, shouldDirty: true, },)
					setValue('longitude', lng, { shouldValidate: true, shouldDirty: true, },)
					if (address) {
						setValue('location', address, { shouldValidate: true, shouldDirty: true, },)
					}
				}}
			/>

			<Box sx={styles.actions}>
				{onCancel && (
					<Button type='button' onClick={onCancel} disabled={loading}>Cancel</Button>
				)}
				<Button
					type='submit'
					variant='contained'
					disabled={loading || !isFormValid || !isDirty}
				>
					{loading ? 'Saving…' : submitLabel}
				</Button>
			</Box>
		</Box>
	)
}
