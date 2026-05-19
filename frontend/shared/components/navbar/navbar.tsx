'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import EventIcon from '@mui/icons-material/Event'
import MapIcon from '@mui/icons-material/Map'
import AddIcon from '@mui/icons-material/Add'
import { ThemeToggle } from '@/shared/components/theme-toggle'
import { styles } from './navbar.styles'

export const Navbar = (): JSX.Element => {
	const pathname = usePathname()
	const isNew = pathname === '/events/new'
	const isMap = pathname === '/map'
	const isEvents = pathname === '/' || (pathname.startsWith('/events/') && !isNew)

	return (
		<AppBar position='sticky' color='default' elevation={0} sx={styles.appBar}>
			<Toolbar>
				<Stack direction='row' spacing={1} alignItems='center' sx={styles.brandStack}>
					<EventIcon color='primary' />
					<Typography variant='h6' component={Link} href='/' sx={styles.brandLink}>
						EMS
					</Typography>
				</Stack>
				<Stack direction='row' spacing={1} alignItems='center'>
					<Button
						component={Link}
						href='/'
						startIcon={<EventIcon />}
						aria-current={isEvents ? 'page' : undefined}
						sx={isEvents ? styles.navButtonActive : styles.navButton}
					>
						Events
					</Button>
					<Button
						component={Link}
						href='/map'
						startIcon={<MapIcon />}
						aria-current={isMap ? 'page' : undefined}
						sx={isMap ? styles.navButtonActive : styles.navButton}
					>
						Map
					</Button>
					{isNew ? (
						<Button
							disabled
							variant='contained'
							startIcon={<AddIcon />}
							aria-current='page'
						>
							New event
						</Button>
					) : (
						<Button
							component={Link}
							href='/events/new'
							variant='contained'
							startIcon={<AddIcon />}
						>
							New event
						</Button>
					)}
					<ThemeToggle />
				</Stack>
			</Toolbar>
		</AppBar>
	)
}
