'use client'
import { useMemo, useState } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import { useGetEvents } from '@/shared/hooks/use-events'
import { useDebounce } from '@/shared/hooks/use-debounce'
import { EventCard } from '@/shared/components/event-card'
import { EventFilters, type FiltersState } from '@/shared/components/event-filters'

const PAGE_SIZE = 12

const EventListPage = () => {
	const [filters, setFilters,] = useState<FiltersState>({
		search: '',
		category: '',
		sortBy: 'date',
		order: 'asc',
	},)
	const [page, setPage,] = useState(1,)

	const debouncedSearch = useDebounce(filters.search,)

	const params = useMemo(() => ({
		page,
		pageSize: PAGE_SIZE,
		sortBy: filters.sortBy,
		order: filters.order,
		category: filters.category || undefined,
		search: debouncedSearch || undefined,
	}), [page, filters.sortBy, filters.order, filters.category, debouncedSearch,],)

	const { data, isLoading, isError, error, } = useGetEvents(params,)

	return (
		<Container maxWidth='lg' sx={{ py: 4, }}>
			<Box sx={{ mb: 3, }}>
				<Typography variant='h1'>Events</Typography>
				<Typography variant='body1' color='text.secondary'>
					{data ? `${data.total} events found` : 'Browse and discover events.'}
				</Typography>
			</Box>

			<EventFilters
				value={filters}
				onChange={(next,) => { setFilters(next,); setPage(1,) }}
			/>

			{isLoading && (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 8, }}>
					<CircularProgress />
				</Box>
			)}

			{isError && (
				<Alert severity='error' sx={{ mb: 3, }}>
					Failed to load events: {(error as Error).message}
				</Alert>
			)}

			{data && data.data.length === 0 && (
				<Alert severity='info'>No events match the current filters.</Alert>
			)}

			{data && data.data.length > 0 && (
				<Box
					sx={{
						display: 'grid',
						gap: 2,
						gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', },
					}}
				>
					{data.data.map((ev,) => <EventCard key={ev.id} event={ev} />,)}
				</Box>
			)}

			{data && data.totalPages > 1 && (
				<Stack direction='row' justifyContent='center' sx={{ mt: 4, }}>
					<Pagination
						count={data.totalPages}
						page={page}
						onChange={(_, p,) => setPage(p,)}
						color='primary'
					/>
				</Stack>
			)}
		</Container>
	)
}

export default EventListPage
