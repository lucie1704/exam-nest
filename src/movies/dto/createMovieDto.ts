import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ 
    description: 'Titre du film',
    example: 'Inception'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    description: 'Description du film',
    example: 'Un voleur qui pénètre dans les rêves des autres',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Année de sortie du film',
    example: 2010,
    minimum: 1888,
    maximum: 2024,
    required: false
  })
  @IsOptional()
  @IsInt()
  @Min(1888)
  @Max(new Date().getFullYear())
  releaseYear?: number;

  @ApiProperty({ 
    description: 'Genre du film',
    example: 'Science-Fiction',
    required: false
  })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiProperty({ 
    description: 'Réalisateur du film',
    example: 'Christopher Nolan',
    required: false
  })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiProperty({ 
    description: 'URL de l\'affiche du film',
    example: 'https://example.com/poster.jpg',
    required: false
  })
  @IsOptional()
  @IsString()
  posterUrl?: string;
} 