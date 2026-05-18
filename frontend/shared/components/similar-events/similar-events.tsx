'use client'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Skeleton from '@mui/material/Skeleton'
import Alert from '@mui/material/Alert'
import { useGetSimilarEvents } from '@/shared/hooks/use-events'
import { CATEGORY_LABELS } from '@/shared/constants/event-categories'
import { formatEventDate } from '@/shared/utils/date-formatter'
import { styles } from './similar-events.styles'

interface SimilarEventsProps {
	eventId: string
}

export const SimilarEvents = ({ eventId, }: SimilarEventsProps,) => {
	const { data, isLoading, isError, } = useGetSimilarEvents(eventId,)

	return (
		<Box sx={styles.root}>
			<Typography variant='h3' sx={styles.title}>Similar events</Typography>

			{isLoading && (
				<Stack spacing={1}>
					<Skeleton variant='rounded' height={64} />
					<Skeleton variant='rounded' height={64} />
					<Skeleton variant='rounded' height={64} />
				</Stack>
			)}

			{isError && <Alert severity='error'>Could not load recommendations.</Alert>}

			{data && data.length === 0 && (
				<Typography variant='body2' color='text.secondary'>
					No similar events found.
				</Typography>
			)}

			{data && data.length > 0 && (
				<Box>
					{data.map((ev,) => (
						<Box key={ev.id} component={Link} href={`/events/${ev.id}`} sx={styles.listItem}>
							<Stack direction='row' alignItems='center' justifyContent='space-between'>
								<Typography variant='subtitle1' sx={{ fontWeight: 600, }}>{ev.title}</Typography>
								<Chip size='small' label={`Score: ${ev.similarityScore}`} sx={styles.scoreBadge} />
							</Stack>
							<Stack direction='row' spacing={1} alignItems='center' sx={{ mt: 0.5, }}>
								<Chip size='small' variant='outlined' label={CATEGORY_LABELS[ev.category]} />
								<Typography variant='caption' color='text.secondary'>
									{formatEventDate(ev.date,)} · {ev.location}
								</Typography>
							</Stack>
						</Box>
					),)}
				</Box>
			)}
		</Box>
	)
}
