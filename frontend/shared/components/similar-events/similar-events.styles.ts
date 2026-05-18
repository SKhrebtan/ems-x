import type { SxProps, Theme } from '@mui/material/styles'

export const styles = {
	root: {
		mt: 4,
	} satisfies SxProps<Theme>,
	title: {
		mb: 2,
	} satisfies SxProps<Theme>,
	listItem: {
		display: 'block',
		py: 1.5,
		borderBottom: '1px solid var(--color-divider)',
		'&:last-of-type': { borderBottom: 'none', },
		'&:hover': { background: 'rgba(var(--color-primary-channel) / 0.04)', },
	} satisfies SxProps<Theme>,
	scoreBadge: {
		ml: 1,
	} satisfies SxProps<Theme>,
} as const
