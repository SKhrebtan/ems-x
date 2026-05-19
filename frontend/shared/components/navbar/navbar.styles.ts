import type { SxProps, Theme } from '@mui/material/styles'

export const styles = {
	appBar: {
		borderBottom: '1px solid var(--color-divider)',
	} satisfies SxProps<Theme>,
	brandStack: {
		flexGrow: 1,
	} satisfies SxProps<Theme>,
	brandLink: {
		fontWeight: 700,
		color: 'inherit',
	} satisfies SxProps<Theme>,
	navButton: {
		color: 'text.primary',
		fontWeight: 500,
	} satisfies SxProps<Theme>,
	navButtonActive: {
		color: 'primary.main',
		fontWeight: 700,
		bgcolor: 'action.selected',
		'&:hover': {
			bgcolor: 'action.selected',
		},
	} satisfies SxProps<Theme>,
} as const
