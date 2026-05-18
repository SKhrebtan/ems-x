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
} as const
