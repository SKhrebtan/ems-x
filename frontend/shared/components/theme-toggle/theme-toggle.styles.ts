import type { SxProps, Theme } from '@mui/material/styles'

export const styles = {
	sun: {
		color: '#fbc02d',
	} satisfies SxProps<Theme>,
	moon: {
		color: '#ffffff',
	} satisfies SxProps<Theme>,
} as const
