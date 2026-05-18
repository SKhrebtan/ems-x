import dynamic from 'next/dynamic'

export const LocationPicker = dynamic(
	async () => {
		const mod = await import('./location-picker')
		return mod.LocationPicker
	},
	{ ssr: false, },
)
