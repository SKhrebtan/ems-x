'use client'
import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { theme } from '@/shared/styles/theme'
import { QueryProvider } from './query-provider'

interface IProps {
	children: React.ReactNode;
}

export const Providers: React.FC<IProps> = ({ children, },) => {
	return (
		<AppRouterCacheProvider options={{ key: 'mui', }}>
			<ThemeProvider theme={theme} defaultMode='light'>
				<CssBaseline />
				<QueryProvider>{children}</QueryProvider>
			</ThemeProvider>
		</AppRouterCacheProvider>
	)
}
