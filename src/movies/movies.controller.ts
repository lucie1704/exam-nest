import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/createMovieDto';
import { RolesGuard, Roles } from '../guards';
import { Role } from '@prisma/client';

@ApiTags('Movies')
@ApiBearerAuth()
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOperation({ summary: 'Créer un nouveau film (ADMIN uniquement)' })
  @ApiBody({ type: CreateMovieDto })
  @ApiResponse({ status: 201, description: 'Film créé avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 403, description: 'Accès refusé - Admin requis' })
  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.createMovie(createMovieDto);
  }

  @ApiOperation({ summary: 'Lister tous les films avec pagination et recherche' })
  @ApiQuery({ name: 'page', required: false, description: 'Numéro de page' })
  @ApiQuery({ name: 'limit', required: false, description: 'Nombre d\'éléments par page' })
  @ApiQuery({ name: 'search', required: false, description: 'Terme de recherche (titre, réalisateur, genre)' })
  @ApiResponse({ status: 200, description: 'Liste des films' })
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.moviesService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
    });
  }

  @ApiOperation({ summary: 'Obtenir un film par son ID' })
  @ApiParam({ name: 'id', description: 'ID du film' })
  @ApiResponse({ status: 200, description: 'Film trouvé' })
  @ApiResponse({ status: 404, description: 'Film non trouvé' })
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @ApiOperation({ summary: 'Modifier un film (ADMIN uniquement)' })
  @ApiParam({ name: 'id', description: 'ID du film' })
  @ApiBody({ type: CreateMovieDto })
  @ApiResponse({ status: 200, description: 'Film modifié avec succès' })
  @ApiResponse({ status: 404, description: 'Film non trouvé' })
  @ApiResponse({ status: 403, description: 'Accès refusé - Admin requis' })
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateMovieDto: Partial<CreateMovieDto>) {
    return this.moviesService.updateMovie(id, updateMovieDto);
  }

  @ApiOperation({ summary: 'Supprimer un film (ADMIN uniquement)' })
  @ApiParam({ name: 'id', description: 'ID du film' })
  @ApiResponse({ status: 200, description: 'Film supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Film non trouvé' })
  @ApiResponse({ status: 403, description: 'Accès refusé - Admin requis' })
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.moviesService.deleteMovie(id);
  }
} 