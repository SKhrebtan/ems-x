import type { SxProps, Theme } from '@mui/material/styles'

export const styles = {
	wrapper: {
		position: 'relative',
		height: 320,
		width: '100%',
		borderRadius: 2,
		overflow: 'hidden',
		border: '1px solid var(--color-divider)',
	} satisfies SxProps<Theme>,
	hint: {
		mb: 1,
		color: 'var(--color-text-secondary)',
	} satisfies SxProps<Theme>,
	loadingBadge: {
		position: 'absolute',
		top: 8,
		right: 8,
		zIndex: 1000,
		px: 1.5,
		py: 0.5,
		fontSize: 12,
		borderRadius: 1,
		background: 'rgba(var(--color-bg-paper-channel) / 0.92)',
		border: '1px solid var(--color-divider)',
	} satisfies SxProps<Theme>,
} as const
