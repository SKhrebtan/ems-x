'use client'
import Link from 'next/link'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PlaceIcon from '@mui/icons-material/Place'
import type { EventItem } from '@/shared/types/event'
import { CATEGORY_LABELS } from '@/shared/constants/event-categories'
import { formatEventDate } from '@/shared/utils/date-formatter'
import { styles } from './event-card.styles'

interface EventCardProps {
	event: EventItem
}

export const EventCard = ({ event, }: EventCardProps,) => {
	return (
		<Card sx={styles.card} variant='outlined'>
			<CardActionArea component={Link} href={`/events/${event.id}`} sx={{ flexGrow: 1, }}>
				<CardContent sx={styles.content}>
					<Chip size='small' color='primary' variant='outlined' label={CATEGORY_LABELS[event.category]} sx={styles.categoryChip} />
					<Typography variant='h6' component='h2' sx={{ mt: 1.5, }}>
						{event.title}
					</Typography>
					<Stack direction='column' spacing={0.5} sx={styles.metaRow}>
						<Stack direction='row' spacing={0.5} alignItems='center'>
							<CalendarTodayIcon fontSize='inherit' />
							<Typography variant='body2'>{formatEventDate(event.date,)}</Typography>
						</Stack>
						<Stack direction='row' spacing={0.5} alignItems='center'>
							<PlaceIcon fontSize='inherit' />
							<Typography variant='body2' noWrap>{event.location}</Typography>
						</Stack>
					</Stack>
					<Typography variant='body2' sx={styles.description}>
						{event.description}
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	)
}
