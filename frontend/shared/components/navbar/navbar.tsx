'use client'
import Link from 'next/link'
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
					<Button component={Link} href='/' startIcon={<EventIcon />}>Events</Button>
					<Button component={Link} href='/map' startIcon={<MapIcon />}>Map</Button>
					<Button component={Link} href='/events/new' variant='contained' startIcon={<AddIcon />}>
						New event
					</Button>
					<ThemeToggle />
				</Stack>
			</Toolbar>
		</AppBar>
	)
}
