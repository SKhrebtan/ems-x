'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { EventForm } from '@/shared/components/event-form'
import { useGetEventById, useUpdateEvent } from '@/shared/hooks/use-events'
import type { EventInput } from '@/shared/types/event'

const EditEventPage = () => {
	const params = useParams<{ id: string, }>()
	const router = useRouter()
	const id = params?.id ?? ''
	const { data, isLoading, isError, error, } = useGetEventById(id,)
	const mutation = useUpdateEvent(id,)
	const [serverError, setServerError,] = useState<string | null>(null,)

	const handleSubmit = async (values: EventInput,) => {
		try {
			setServerError(null,)
			await mutation.mutateAsync(values,)
			router.push(`/events/${id}`,)
		}
		catch (err) {
			setServerError((err as Error).message,)
		}
	}

	return (
		<Container maxWidth='md' sx={{ py: 4, }}>
			<Box sx={{ mb: 3, }}>
				<Typography variant='h1'>Edit event</Typography>
			</Box>

			{isLoading && (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 8, }}>
					<CircularProgress />
				</Box>
			)}

			{isError && (
				<Alert severity='error'>{(error as Error).message || 'Failed to load event.'}</Alert>
			)}

			{data && (
				<EventForm
					initial={{
						title: data.title,
						description: data.description,
						date: data.date,
						location: data.location,
						latitude: data.latitude ?? undefined,
						longitude: data.longitude ?? undefined,
						category: data.category,
					}}
					submitLabel='Save changes'
					loading={mutation.isPending}
					serverError={serverError}
					onSubmit={handleSubmit}
					onCancel={() => router.push(`/events/${id}`,)}
				/>
			)}
		</Container>
	)
}

export default EditEventPage
