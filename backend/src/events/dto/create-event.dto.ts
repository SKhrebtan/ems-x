import {
  IsDateString,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventCategory } from '@prisma/client';

export class CreateEventDto {
  @ApiProperty({
    description: 'Human-readable event title shown in lists and details.',
    example: 'Dublin Tech Summit 2026',
    minLength: 3,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title!: string;

  @ApiProperty({
    description: 'Full event description (plain text, multi-paragraph allowed).',
    example: 'Annual gathering of software engineers and product leaders across Ireland.',
    minLength: 10,
    maxLength: 5000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(5000)
  description!: string;

  @ApiProperty({
    description: 'Event start date & time as an ISO-8601 string.',
    example: '2026-06-15T09:00:00.000Z',
    format: 'date-time',
  })
  @IsDateString()
  date!: string;

  @ApiProperty({
    description: 'Human-readable address shown to the user.',
    example: 'Convention Centre Dublin, Spencer Dock, Dublin 1',
    maxLength: 300,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  location!: string;

  @ApiPropertyOptional({
    description: 'Latitude in decimal degrees (−90 to 90). Used for the map view and the location signal of the recommendation algorithm.',
    example: 53.3478,
    minimum: -90,
    maximum: 90,
  })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitude in decimal degrees (−180 to 180). Required together with latitude for the event to appear on the map.',
    example: -6.2418,
    minimum: -180,
    maximum: 180,
  })
  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @ApiProperty({
    description: 'Event category — used by filters and as the dominant signal of the recommendation algorithm.',
    enum: EventCategory,
    example: EventCategory.CONFERENCE,
  })
  @IsEnum(EventCategory)
  category!: EventCategory;
}
