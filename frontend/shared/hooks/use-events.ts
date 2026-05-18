import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from '@tanstack/react-query'
import { eventsService } from '@/shared/services/events.service'
import { QUERY_KEYS } from '@/shared/constants/query-keys'
import type {
	EventInput,
	EventItem,
	ListEventsParams,
	PaginatedEvents,
	ScoredEvent,
} from '@/shared/types/event'

export const useGetEvents = (params: ListEventsParams = {},):
	UseQueryResult<PaginatedEvents> => {
	return useQuery({
		queryKey: [QUERY_KEYS.EVENTS, params,],
		queryFn: async () => {
			return eventsService.list(params,)
		},
		placeholderData: (previous,) => previous,
	},)
}

export const useGetEventById = (id: string,):
	UseQueryResult<EventItem> => {
	return useQuery({
		queryKey: [QUERY_KEYS.EVENT, id,],
		queryFn: async () => {
			return eventsService.get(id,)
		},
		enabled: Boolean(id.trim(),),
	},)
}

export const useGetSimilarEvents = (id: string,):
	UseQueryResult<ScoredEvent[]> => {
	return useQuery({
		queryKey: [QUERY_KEYS.EVENT_SIMILAR, id,],
		queryFn: async () => {
			return eventsService.similar(id,)
		},
		enabled: Boolean(id.trim(),),
	},)
}

export const useCreateEvent = ():
	UseMutationResult<EventItem, Error, EventInput> => {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: async (data: EventInput,) => {
			return eventsService.create(data,)
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS,], },)
		},
	},)
}

export const useUpdateEvent = (id: string,):
	UseMutationResult<EventItem, Error, Partial<EventInput>> => {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: async (data: Partial<EventInput>,) => {
			return eventsService.update(id, data,)
		},
		onSuccess: (updated,) => {
			qc.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS,], },)
			qc.setQueryData([QUERY_KEYS.EVENT, id,], updated,)
			qc.invalidateQueries({ queryKey: [QUERY_KEYS.EVENT_SIMILAR, id,], },)
		},
	},)
}

export const useDeleteEvent = ():
	UseMutationResult<{ id: string, }, Error, string> => {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: async (id: string,) => {
			return eventsService.remove(id,)
		},
		onSuccess: (_, id,) => {
			qc.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS,], },)
			qc.removeQueries({ queryKey: [QUERY_KEYS.EVENT, id,], },)
		},
	},)
}
