'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PlaceIcon from '@mui/icons-material/Place'
import { useDeleteEvent, useGetEventById } from '@/shared/hooks/use-events'
import { CATEGORY_LABELS } from '@/shared/constants/event-categories'
import { formatEventDate } from '@/shared/utils/date-formatter'
import { SimilarEvents } from '@/shared/components/similar-events'
import { DeleteConfirmDialog } from '@/shared/components/delete-confirm-dialog'

const EventDetailsPage = () => {
	const params = useParams<{ id: string, }>()
	const router = useRouter()
	const id = params?.id ?? ''
	const { data, isLoading, isError, error, } = useGetEventById(id,)
	const deleteMutation = useDeleteEvent()
	const [confirmOpen, setConfirmOpen,] = useState(false,)

	const handleDelete = async () => {
		try {
			await deleteMutation.mutateAsync(id,)
			router.push('/',)
		}
		catch {
			setConfirmOpen(false,)
		}
	}

	return (
		<Container maxWidth='md' sx={{ py: 4, }}>
			<Button component={Link} href='/' startIcon={<ArrowBackIcon />} sx={{ mb: 2, }}>
				Back to events
			</Button>

			{isLoading && (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 8, }}>
					<CircularProgress />
				</Box>
			)}

			{isError && (
				<Alert severity='error'>
					{(error as Error).message || 'Failed to load event.'}
				</Alert>
			)}

			{data && (
				<>
					<Box sx={{ mb: 3, }}>
						<Chip label={CATEGORY_LABELS[data.category]} color='primary' variant='outlined' />
						<Typography variant='h1' sx={{ mt: 1.5, }}>{data.title}</Typography>

						<Stack direction='column' spacing={0.5} sx={{ mt: 2, color: 'text.secondary', }}>
							<Stack direction='row' spacing={1} alignItems='center'>
								<CalendarTodayIcon fontSize='small' />
								<Typography variant='body1'>{formatEventDate(data.date,)}</Typography>
							</Stack>
							<Stack direction='row' spacing={1} alignItems='center'>
								<PlaceIcon fontSize='small' />
								<Typography variant='body1'>{data.location}</Typography>
							</Stack>
						</Stack>
					</Box>

					<Typography variant='body1' sx={{ whiteSpace: 'pre-wrap', mb: 4, }}>
						{data.description}
					</Typography>

					<Stack direction='row' spacing={1}>
						<Button
							component={Link}
							href={`/events/${data.id}/edit`}
							variant='outlined'
							startIcon={<EditIcon />}
						>
							Edit
						</Button>
						<Button
							onClick={() => setConfirmOpen(true,)}
							color='error'
							variant='outlined'
							startIcon={<DeleteIcon />}
						>
							Delete
						</Button>
					</Stack>

					<SimilarEvents eventId={data.id} />

					<DeleteConfirmDialog
						open={confirmOpen}
						title={`Delete "${data.title}"?`}
						description='The event will be permanently removed.'
						loading={deleteMutation.isPending}
						onConfirm={handleDelete}
						onCancel={() => setConfirmOpen(false,)}
					/>
				</>
			)}
		</Container>
	)
}

export default EventDetailsPage
