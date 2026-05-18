'use client'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { useGetEvents } from '@/shared/hooks/use-events'
import { EventsMap } from '@/shared/components/events-map'

const MapPage = () => {
	const { data, isLoading, isError, error, } = useGetEvents({ pageSize: 100, },)
	const located = data?.data.filter((e,) => e.latitude != null && e.longitude != null,) ?? []

	return (
		<Container maxWidth='xl' sx={{ py: 4, }}>
			<Box sx={{ mb: 3, }}>
				<Typography variant='h1'>Event map</Typography>
				<Typography variant='body1' color='text.secondary'>
					{data
						? `${located.length} of ${data.total} events have coordinates`
						: 'Loading map…'}
				</Typography>
			</Box>

			{isLoading && (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 8, }}>
					<CircularProgress />
				</Box>
			)}

			{isError && (
				<Alert severity='error'>{(error as Error).message}</Alert>
			)}

			{data && <EventsMap events={data.data} />}
		</Container>
	)
}

export default MapPage
