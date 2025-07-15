import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, Max, IsEnum } from 'class-validator';
import { WatchStatus } from '@prisma/client';

export class AddToWatchlistDto {
  @ApiProperty({ 
    description: 'ID du film à ajouter à la watchlist',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  movieId: string;

  @ApiProperty({ 
    description: 'Statut du film dans la watchlist',
    enum: WatchStatus,
    example: 'WANT_TO_WATCH',
    required: false
  })
  @IsOptional()
  @IsEnum(WatchStatus)
  status?: WatchStatus;

  @ApiProperty({ 
    description: 'Note du film (sur 5)',
    example: 4,
    minimum: 1,
    maximum: 5,
    required: false
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({ 
    description: 'Notes personnelles sur le film',
    example: 'Film très attendu !',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;
} 