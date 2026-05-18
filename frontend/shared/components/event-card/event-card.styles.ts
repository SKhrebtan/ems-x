import type { SxProps, Theme } from '@mui/material/styles'

export const styles = {
	card: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		transition: 'transform 0.15s ease, box-shadow 0.15s ease',
		'&:hover': {
			transform: 'translateY(-2px)',
			boxShadow: 4,
		},
	} satisfies SxProps<Theme>,
	content: {
		flexGrow: 1,
	} satisfies SxProps<Theme>,
	metaRow: {
		mt: 1,
		mb: 1.5,
		color: 'var(--color-text-secondary)',
	} satisfies SxProps<Theme>,
	description: {
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 3,
		overflow: 'hidden',
		color: 'var(--color-text-secondary)',
	} satisfies SxProps<Theme>,
	categoryChip: {
		alignSelf: 'flex-start',
	} satisfies SxProps<Theme>,
} as const
