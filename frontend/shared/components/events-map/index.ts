import dynamic from 'next/dynamic'

export const EventsMap = dynamic(
	async () => {
		const mod = await import('./events-map')
		return mod.EventsMap
	},
	{ ssr: false, },
)
