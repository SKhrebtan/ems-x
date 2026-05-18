import type { SxProps, Theme } from '@mui/material/styles'

export const styles = {
	wrapper: {
		height: 'calc(100vh - 200px)',
		minHeight: 480,
		width: '100%',
		borderRadius: 2,
		overflow: 'hidden',
		border: '1px solid var(--color-divider)',
	} satisfies SxProps<Theme>,
	popupTitle: {
		fontWeight: 600,
		marginBottom: 4,
	},
	popupMeta: {
		fontSize: 12,
		color: '#666',
	},
} as const
