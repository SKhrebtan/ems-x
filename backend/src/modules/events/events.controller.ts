import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryEventsDto } from './dto/query-events.dto';
import { RecommendationsService } from '../recommendations/recommendations.service';
import {
  EVENTS_ROUTES,
  EVENTS_SWAGGER,
  EVENTS_SWAGGER_TAG,
  SIMILAR_THROTTLE,
} from './events.constants';

@ApiTags(EVENTS_SWAGGER_TAG)
@Controller(EVENTS_ROUTES.BASE)
export class EventsController {
  constructor(
    private readonly events: EventsService,
    private readonly recommendations: RecommendationsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation(EVENTS_SWAGGER.CREATE.operation)
  @ApiResponse(EVENTS_SWAGGER.CREATE.responses.created)
  @ApiResponse(EVENTS_SWAGGER.CREATE.responses.badRequest)
  public create(@Body() dto: CreateEventDto,) {
    return this.events.create(dto,)
  }

  @Get()
  @ApiOperation(EVENTS_SWAGGER.LIST.operation)
  @ApiResponse(EVENTS_SWAGGER.LIST.responses.ok)
  public findAll(@Query() query: QueryEventsDto,) {
    return this.events.findAll(query,)
  }

  @Get(EVENTS_ROUTES.GET_ONE)
  @ApiOperation(EVENTS_SWAGGER.GET_ONE.operation)
  @ApiParam(EVENTS_SWAGGER.PARAM_ID)
  @ApiResponse(EVENTS_SWAGGER.GET_ONE.responses.ok)
  @ApiResponse(EVENTS_SWAGGER.GET_ONE.responses.notFound)
  public findOne(@Param('id', ParseUUIDPipe,) id: string,) {
    return this.events.findOne(id,)
  }

  @Get(EVENTS_ROUTES.SIMILAR)
  @Throttle({ default: SIMILAR_THROTTLE, },)
  @ApiOperation(EVENTS_SWAGGER.SIMILAR.operation)
  @ApiParam(EVENTS_SWAGGER.PARAM_ID)
  @ApiResponse(EVENTS_SWAGGER.SIMILAR.responses.ok)
  @ApiResponse(EVENTS_SWAGGER.SIMILAR.responses.notFound)
  public similar(@Param('id', ParseUUIDPipe,) id: string,) {
    return this.recommendations.findSimilar(id,)
  }

  @Patch(EVENTS_ROUTES.UPDATE)
  @ApiOperation(EVENTS_SWAGGER.UPDATE.operation)
  @ApiParam(EVENTS_SWAGGER.PARAM_ID)
  @ApiResponse(EVENTS_SWAGGER.UPDATE.responses.ok)
  @ApiResponse(EVENTS_SWAGGER.UPDATE.responses.badRequest)
  @ApiResponse(EVENTS_SWAGGER.UPDATE.responses.notFound)
  public update(
    @Param('id', ParseUUIDPipe,) id: string,
    @Body() dto: UpdateEventDto,
  ) {
    return this.events.update(id, dto,)
  }

  @Delete(EVENTS_ROUTES.DELETE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(EVENTS_SWAGGER.DELETE.operation)
  @ApiParam(EVENTS_SWAGGER.PARAM_ID)
  @ApiResponse(EVENTS_SWAGGER.DELETE.responses.ok)
  @ApiResponse(EVENTS_SWAGGER.DELETE.responses.notFound)
  public remove(@Param('id', ParseUUIDPipe,) id: string,) {
    return this.events.remove(id,)
  }
}
