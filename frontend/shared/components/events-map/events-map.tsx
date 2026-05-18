'use client'
import { useMemo } from 'react'
import Link from 'next/link'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Box from '@mui/material/Box'
import type { EventItem } from '@/shared/types/event'
import { CATEGORY_LABELS } from '@/shared/constants/event-categories'
import { formatEventDate } from '@/shared/utils/date-formatter'
import { styles } from './events-map.styles'

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
	iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
	iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
	shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
},)

const DEFAULT_CENTER: [number, number,] = [53.3478, -6.2418,]
const DEFAULT_ZOOM = 7

interface EventsMapProps {
	events: EventItem[]
}

export const EventsMap = ({ events, }: EventsMapProps,) => {
	const located = useMemo(
		() => events.filter((e,) => e.latitude != null && e.longitude != null,),
		[events,],
	)

	const center = useMemo<[number, number,]>(() => {
		if (located.length === 0) return DEFAULT_CENTER
		const lat = located.reduce((acc, e,) => acc + (e.latitude as number), 0,) / located.length
		const lon = located.reduce((acc, e,) => acc + (e.longitude as number), 0,) / located.length
		return [lat, lon,]
	}, [located,],)

	return (
		<Box sx={styles.wrapper}>
			<MapContainer
				center={center}
				zoom={DEFAULT_ZOOM}
				scrollWheelZoom
				style={{ width: '100%', height: '100%', }}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				/>
				{located.map((ev,) => (
					<Marker
						key={ev.id}
						position={[ev.latitude as number, ev.longitude as number,]}
					>
						<Popup>
							<div style={styles.popupTitle}>{ev.title}</div>
							<div style={styles.popupMeta}>
								{CATEGORY_LABELS[ev.category]} · {formatEventDate(ev.date,)}
							</div>
							<div style={styles.popupMeta}>{ev.location}</div>
							<Link href={`/events/${ev.id}`}>View details →</Link>
						</Popup>
					</Marker>
				),)}
			</MapContainer>
		</Box>
	)
}
