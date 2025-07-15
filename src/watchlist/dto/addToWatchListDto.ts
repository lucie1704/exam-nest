import { IsString, IsOptional, IsInt, Min, Max, IsEnum } from 'class-validator';
import { WatchStatus } from '@prisma/client';

export class AddToWatchlistDto {
  @IsString()
  movieId: string;

  @IsOptional()
  @IsEnum(WatchStatus)
  status?: WatchStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  notes?: string;
} 