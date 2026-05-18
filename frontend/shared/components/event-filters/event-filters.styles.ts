import type { SxProps, Theme } from '@mui/material/styles'

export const styles = {
	root: {
		p: 2,
		mb: 3,
		borderRadius: 2,
		border: '1px solid var(--color-divider)',
		background: 'var(--color-bg-paper)',
	} satisfies SxProps<Theme>,
	row: {
		display: 'grid',
		gap: 2,
		gridTemplateColumns: {
			xs: '1fr',
			sm: '1fr 1fr',
			md: '2fr 1fr 1fr 1fr 1fr',
		},
		alignItems: 'center',
	} satisfies SxProps<Theme>,
} as const
