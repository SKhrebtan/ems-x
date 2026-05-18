'use client'
import { useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { useColorScheme } from '@mui/material/styles'
import { ThemeMode, useThemeStore } from '@/store/use-theme-store'
import { styles } from './theme-toggle.styles'

export const ThemeToggle = () => {
	const mode = useThemeStore((s) => s.mode)
	const toggleMode = useThemeStore((s) => s.toggleMode)
	const { setMode, } = useColorScheme()
	const [mounted, setMounted,] = useState(false,)

	useEffect(() => {
		setMounted(true,)
	}, [],)

	useEffect(() => {
		if (mounted) setMode(mode,)
	}, [mounted, mode, setMode,],)

	if (!mounted) {
		return (
			<IconButton disabled aria-label='Toggle theme'>
				<DarkModeIcon />
			</IconButton>
		)
	}

	const isDark = mode === ThemeMode.Dark

	return (
		<Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
			<IconButton onClick={toggleMode} aria-label='Toggle theme'>
				{isDark
					? <DarkModeIcon sx={styles.moon} />
					: <LightModeIcon sx={styles.sun} />
				}
			</IconButton>
		</Tooltip>
	)
}
