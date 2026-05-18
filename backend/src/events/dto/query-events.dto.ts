import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EventCategory } from '@prisma/client';

export type EventSortField = 'date' | 'createdAt' | 'title';
export type SortOrder = 'asc' | 'desc';

export class QueryEventsDto {
  @ApiPropertyOptional({
    description: 'Filter by exact category match.',
    enum: EventCategory,
  })
  @IsOptional()
  @IsEnum(EventCategory)
  category?: EventCategory;

  @ApiPropertyOptional({
    description: 'Inclusive lower bound for the event date (ISO-8601).',
    example: '2026-06-01T00:00:00.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({
    description: 'Inclusive upper bound for the event date (ISO-8601).',
    example: '2026-12-31T23:59:59.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({
    description: 'Case-insensitive substring match against title, description, and location.',
    example: 'workshop',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Field to sort by.',
    enum: ['date', 'createdAt', 'title'],
    default: 'date',
  })
  @IsOptional()
  @IsIn(['date', 'createdAt', 'title'])
  sortBy?: EventSortField = 'date';

  @ApiPropertyOptional({
    description: 'Sort direction.',
    enum: ['asc', 'desc'],
    default: 'asc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: SortOrder = 'asc';

  @ApiPropertyOptional({
    description: 'Page size (1–100).',
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;

  @ApiPropertyOptional({
    description: '1-indexed page number.',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page?: number = 1;
}
