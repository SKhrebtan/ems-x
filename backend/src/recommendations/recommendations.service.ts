import {
	HttpException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { MESSAGES } from '../shared/constants/messages'
import { RECOMMENDATION_CONFIG } from './recommendations.constants'
import type { ScoredEvent } from './recommendations.types'
import { scoreSimilarity } from './recommendations.utils'

@Injectable()
export class RecommendationsService {
	constructor(private readonly prisma: PrismaService,) {}

	public async findSimilar(
		eventId: string,
		limit: number = RECOMMENDATION_CONFIG.defaultLimit,
	): Promise<ScoredEvent[]> {
		try {
			const target = await this.prisma.event.findUnique({
				where: { id: eventId, },
			},)
			if (!target) throw new NotFoundException(MESSAGES.ERROR.EVENT_NOT_FOUND(eventId,),)

			const candidates = await this.prisma.event.findMany({
				where: { id: { not: eventId, }, },
			},)

			return candidates
				.map((event,) => ({
					...event,
					similarityScore: scoreSimilarity(target, event,),
				}),)
				.filter((e,) => e.similarityScore > 0,)
				.sort((a, b,) => b.similarityScore - a.similarityScore,)
				.slice(0, limit,)
		}
		catch (error) {
			if (error instanceof HttpException) throw error
			throw new InternalServerErrorException(MESSAGES.ERROR.SIMILAR_FETCH_FAILED,)
		}
	}
}
