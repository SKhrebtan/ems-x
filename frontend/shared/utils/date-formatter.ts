import { format, formatDistanceToNow, parseISO } from 'date-fns'

export const formatEventDate = (iso: string,): string => {
	return format(parseISO(iso,), 'EEE, d MMM yyyy · HH:mm',)
}

export const formatRelative = (iso: string,): string => {
	return formatDistanceToNow(parseISO(iso,), { addSuffix: true, },)
}
