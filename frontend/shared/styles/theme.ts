'use client'
import { createTheme } from '@mui/material/styles'

const paletteFromCssVars = {
	primary: {
		main: 'var(--color-primary)',
		mainChannel: 'var(--color-primary-channel)',
		light: 'var(--color-primary-light)',
		lightChannel: 'var(--color-primary-light-channel)',
		dark: 'var(--color-primary-dark)',
		darkChannel: 'var(--color-primary-dark-channel)',
		contrastText: 'var(--color-primary-contrast)',
	},
	secondary: {
		main: 'var(--color-secondary)',
		mainChannel: 'var(--color-secondary-channel)',
		light: 'var(--color-secondary-light)',
		lightChannel: 'var(--color-secondary-light-channel)',
		dark: 'var(--color-secondary-dark)',
		darkChannel: 'var(--color-secondary-dark-channel)',
		contrastText: 'var(--color-secondary-contrast)',
	},
	background: {
		default: 'var(--color-bg-default)',
		defaultChannel: 'var(--color-bg-default-channel)',
		paper: 'var(--color-bg-paper)',
		paperChannel: 'var(--color-bg-paper-channel)',
	},
	text: {
		primary: 'var(--color-text-primary)',
		primaryChannel: 'var(--color-text-primary-channel)',
		secondary: 'var(--color-text-secondary)',
		secondaryChannel: 'var(--color-text-secondary-channel)',
	},
	divider: 'var(--color-divider)',
	dividerChannel: 'var(--color-divider-channel)',
}

export const theme = createTheme({
	cssVariables: {
		cssVarPrefix: 'ems',
		colorSchemeSelector: 'data-mui-color-scheme',
	},
	colorSchemes: {
		light: { palette: paletteFromCssVars, },
		dark: { palette: paletteFromCssVars, },
	},
	shape: { borderRadius: 10, },
	typography: {
		fontFamily: [
			'Inter',
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'sans-serif',
		].join(', ',),
		h1: { fontSize: '2rem', fontWeight: 700, },
		h2: { fontSize: '1.6rem', fontWeight: 700, },
		h3: { fontSize: '1.3rem', fontWeight: 600, },
	},
	components: {
		MuiButton: {
			defaultProps: { disableElevation: true, },
			styleOverrides: {
				root: { textTransform: 'none', fontWeight: 600, },
			},
		},
		MuiCard: {
			styleOverrides: {
				root: { borderRadius: 12, },
			},
		},
	},
})
