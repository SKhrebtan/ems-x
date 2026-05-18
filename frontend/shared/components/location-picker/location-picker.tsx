'use client'
import { useEffect, useState } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { reverseGeocode } from './location-picker.helpers'
import { styles } from './location-picker.styles'

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
	iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
	iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
	shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
},)

const DEFAULT_CENTER: [number, number,] = [53.3478, -6.2418,]
const DEFAULT_ZOOM = 6
const PICKED_ZOOM = 14

export interface LocationPickerProps {
	latitude: number | null | undefined
	longitude: number | null | undefined
	onPick: (lat: number, lng: number, address?: string,) => void
}

interface ClickHandlerProps {
	onClick: (lat: number, lng: number,) => void
}

const ClickHandler = ({ onClick, }: ClickHandlerProps,) => {
	useMapEvents({
		click: (e,) => onClick(e.latlng.lat, e.latlng.lng,),
	},)
	return null
}

interface RecenterProps {
	position: [number, number,] | null
}

const Recenter = ({ position, }: RecenterProps,) => {
	const map = useMap()
	useEffect(() => {
		if (position) {
			map.flyTo(position, PICKED_ZOOM, { duration: 0.6, },)
		}
	}, [position, map,],)
	return null
}

export const LocationPicker = ({ latitude, longitude, onPick, }: LocationPickerProps,) => {
	const [isLookingUp, setIsLookingUp,] = useState(false,)

	const hasPick =
		typeof latitude === 'number' && Number.isFinite(latitude,) &&
		typeof longitude === 'number' && Number.isFinite(longitude,)
	const center: [number, number,] = hasPick
		? [latitude as number, longitude as number,]
		: DEFAULT_CENTER

	const handleClick = async (lat: number, lng: number,) => {
		const rounded = {
			lat: Math.round(lat * 1_000_000,) / 1_000_000,
			lng: Math.round(lng * 1_000_000,) / 1_000_000,
		}
		onPick(rounded.lat, rounded.lng,)

		setIsLookingUp(true,)
		try {
			const result = await reverseGeocode(rounded.lat, rounded.lng,)
			if (result) onPick(rounded.lat, rounded.lng, result.displayName,)
		}
		catch {
			/* ignore — user can still type the location manually */
		}
		finally {
			setIsLookingUp(false,)
		}
	}

	return (
		<Box>
			<Typography variant='body2' sx={styles.hint}>
				Click on the map to drop a pin — the location will be looked up automatically.
			</Typography>
			<Box sx={styles.wrapper}>
				{isLookingUp && <Box sx={styles.loadingBadge}>Looking up address…</Box>}
				<MapContainer
					center={center}
					zoom={hasPick ? PICKED_ZOOM : DEFAULT_ZOOM}
					scrollWheelZoom
					style={{ width: '100%', height: '100%', }}
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					/>
					<ClickHandler onClick={handleClick} />
					<Recenter position={hasPick ? center : null} />
					{hasPick && <Marker position={center} />}
				</MapContainer>
			</Box>
		</Box>
	)
}
