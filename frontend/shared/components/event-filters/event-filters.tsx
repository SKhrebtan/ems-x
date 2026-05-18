'use client'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import { CATEGORY_LABELS, EVENT_CATEGORIES, } from '@/shared/constants/event-categories'
import type { EventCategory } from '@/shared/types/event'
import { styles } from './event-filters.styles'

export interface FiltersState {
	search: string
	category: EventCategory | ''
	sortBy: 'date' | 'createdAt' | 'title'
	order: 'asc' | 'desc'
}

interface EventFiltersProps {
	value: FiltersState
	onChange: (next: FiltersState,) => void
}

const SORT_OPTIONS: { value: FiltersState['sortBy']; label: string, }[] = [
	{ value: 'date', label: 'Date', },
	{ value: 'createdAt', label: 'Recently added', },
	{ value: 'title', label: 'Title', },
]

export const EventFilters = ({ value, onChange, }: EventFiltersProps,) => {
	const update = <K extends keyof FiltersState,>(key: K, v: FiltersState[K],) => {
		onChange({ ...value, [key]: v, },)
	}

	return (
		<Box sx={styles.root}>
			<Box sx={styles.row}>
				<TextField
					label='Search'
					size='small'
					fullWidth
					value={value.search}
					onChange={(e,) => update('search', e.target.value,)}
					placeholder='Title, description, or location'
				/>
				<TextField
					select
					label='Category'
					size='small'
					value={value.category}
					onChange={(e,) => update('category', e.target.value as FiltersState['category'],)}
				>
					<MenuItem value=''>All</MenuItem>
					{EVENT_CATEGORIES.map((c,) => (
						<MenuItem key={c} value={c}>{CATEGORY_LABELS[c]}</MenuItem>
					),)}
				</TextField>
				<TextField
					select
					label='Sort by'
					size='small'
					value={value.sortBy}
					onChange={(e,) => update('sortBy', e.target.value as FiltersState['sortBy'],)}
				>
					{SORT_OPTIONS.map((o,) => (
						<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
					),)}
				</TextField>
				<TextField
					select
					label='Order'
					size='small'
					value={value.order}
					onChange={(e,) => update('order', e.target.value as FiltersState['order'],)}
				>
					<MenuItem value='asc'>Ascending</MenuItem>
					<MenuItem value='desc'>Descending</MenuItem>
				</TextField>
			</Box>
		</Box>
	)
}
