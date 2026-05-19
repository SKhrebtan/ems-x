import {
	HttpException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import type { Event, Prisma } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'
import { MESSAGES } from '../../shared/constants/messages'
import { CreateEventDto } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto'
import { QueryEventsDto } from './dto/query-events.dto'
import { buildEventsOrderBy, buildEventsWhereClause } from './events.utils'
import type { DeleteEventResult, PaginatedEvents } from './events.types'

@Injectable()
export class EventsService {
	constructor(private readonly prisma: PrismaService,) {}

	public async create(dto: CreateEventDto,): Promise<Event> {
		try {
			return await this.prisma.event.create({
				data: { ...dto, date: new Date(dto.date,), },
			},)
		}
		catch (error) {
			if (error instanceof HttpException) throw error
			throw new InternalServerErrorException(MESSAGES.ERROR.EVENT_CREATE_FAILED,)
		}
	}

	public async findAll(query: QueryEventsDto,): Promise<PaginatedEvents> {
		try {
			const page = query.page ?? 1
			const pageSize = query.pageSize ?? 20
			const skip = (page - 1) * pageSize

			const where = buildEventsWhereClause(query,)
			const orderBy = buildEventsOrderBy(query,)

			const [data, total,] = await this.prisma.$transaction([
				this.prisma.event.findMany({ where, orderBy, skip, take: pageSize, },),
				this.prisma.event.count({ where, },),
			],)

			return {
				data,
				total,
				page,
				pageSize,
				totalPages: Math.max(1, Math.ceil(total / pageSize,),),
			}
		}
		catch (error) {
			if (error instanceof HttpException) throw error
			throw new InternalServerErrorException(MESSAGES.ERROR.EVENTS_FETCH_FAILED,)
		}
	}

	public async findOne(id: string,): Promise<Event> {
		try {
			const event = await this.prisma.event.findUnique({ where: { id, }, },)
			if (!event) throw new NotFoundException(MESSAGES.ERROR.EVENT_NOT_FOUND(id,),)
			return event
		}
		catch (error) {
			if (error instanceof HttpException) throw error
			throw new InternalServerErrorException(MESSAGES.ERROR.UNEXPECTED,)
		}
	}

	public async update(id: string, dto: UpdateEventDto,): Promise<Event> {
		try {
			await this.findOne(id,)
			const data: Prisma.EventUpdateInput = { ...dto, }
			if (dto.date) data.date = new Date(dto.date,)
			return await this.prisma.event.update({ where: { id, }, data, },)
		}
		catch (error) {
			if (error instanceof HttpException) throw error
			throw new InternalServerErrorException(MESSAGES.ERROR.EVENT_UPDATE_FAILED,)
		}
	}

	public async remove(id: string,): Promise<DeleteEventResult> {
		try {
			await this.findOne(id,)
			await this.prisma.event.delete({ where: { id, }, },)
			return { id, }
		}
		catch (error) {
			if (error instanceof HttpException) throw error
			throw new InternalServerErrorException(MESSAGES.ERROR.EVENT_DELETE_FAILED,)
		}
	}
}
