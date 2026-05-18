export interface ReverseGeocodeResult {
	displayName: string
}

export const reverseGeocode = async (
	lat: number,
	lng: number,
	signal?: AbortSignal,
): Promise<ReverseGeocodeResult | null> => {
	const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`
	const res = await fetch(url, {
		signal,
		headers: { 'Accept-Language': 'en', },
	},)
	if (!res.ok) return null
	const data = (await res.json()) as { display_name?: string, }
	if (!data?.display_name) return null
	return { displayName: data.display_name, }
}
