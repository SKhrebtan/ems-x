import type { SxProps, Theme } from '@mui/material/styles'

export const styles = {
	form: {
		display: 'grid',
		gap: 2,
	} satisfies SxProps<Theme>,
	twoCol: {
		display: 'grid',
		gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', },
		gap: 2,
	} satisfies SxProps<Theme>,
	actions: {
		display: 'flex',
		gap: 1,
		justifyContent: 'flex-end',
		mt: 1,
	} satisfies SxProps<Theme>,
} as const
