'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { EventForm } from '@/shared/components/event-form'
import { useCreateEvent } from '@/shared/hooks/use-events'
import type { EventInput } from '@/shared/types/event'

const NewEventPage = () => {
	const router = useRouter()
	const mutation = useCreateEvent()
	const [serverError, setServerError,] = useState<string | null>(null,)

	const handleSubmit = async (values: EventInput,) => {
		try {
			setServerError(null,)
			const created = await mutation.mutateAsync(values,)
			router.push(`/events/${created.id}`,)
		}
		catch (err) {
			setServerError((err as Error).message,)
		}
	}

	return (
		<Container maxWidth='md' sx={{ py: 4, }}>
			<Box sx={{ mb: 3, }}>
				<Typography variant='h1'>Create event</Typography>
				<Typography variant='body1' color='text.secondary'>
					Fill in the details below.
				</Typography>
			</Box>
			<EventForm
				submitLabel='Create event'
				loading={mutation.isPending}
				serverError={serverError}
				restrictPastDates
				onSubmit={handleSubmit}
				onCancel={() => router.push('/',)}
			/>
		</Container>
	)
}

export default NewEventPage
