import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { WatchlistService } from './watchlist.service';
import { AddToWatchlistDto } from './dto/addToWatchListDto';
import { RolesGuard, Roles } from '../guards';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from '../guards';

@ApiTags('Watchlist')
@ApiBearerAuth()
@Controller('watchlist')
@UseGuards(RolesGuard)
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @ApiOperation({ summary: 'Ajouter un film à sa watchlist' })
  @ApiBody({ type: AddToWatchlistDto })
  @ApiResponse({ status: 201, description: 'Film ajouté à la watchlist' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 404, description: 'Film non trouvé' })
  @Post()
  @Roles(Role.USER, Role.ADMIN)
  addToWatchlist(
    @Body() addToWatchlistDto: AddToWatchlistDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const user = request.user;
    return this.watchlistService.addToWatchlist(
      user.sub,
      addToWatchlistDto.movieId,
      addToWatchlistDto,
    );
  }

  @ApiOperation({ summary: 'Voir sa propre watchlist' })
  @ApiResponse({ status: 200, description: 'Liste des films de la watchlist' })
  @Get('my')
  @Roles(Role.USER, Role.ADMIN)
  getMyWatchlist(@Req() request: AuthenticatedRequest) {
    const user = request.user;
    return this.watchlistService.getUserWatchlist(
      user.sub,
      user.sub,
      user.role,
    );
  }

  @ApiOperation({ summary: 'Voir ses statistiques de watchlist' })
  @ApiResponse({ status: 200, description: 'Statistiques de la watchlist' })
  @Get('my/stats')
  @Roles(Role.USER, Role.ADMIN)
  getMyWatchlistStats(@Req() request: AuthenticatedRequest) {
    const user = request.user;
    return this.watchlistService.getWatchlistStats(
      user.sub,
      user.sub,
      user.role,
    );
  }

  @ApiOperation({ summary: 'Voir la watchlist d\'un utilisateur (ADMIN uniquement)' })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Watchlist de l\'utilisateur' })
  @ApiResponse({ status: 403, description: 'Accès refusé - Admin requis' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @Get('user/:userId')
  @Roles(Role.ADMIN)
  getUserWatchlist(
    @Param('userId') userId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    const user = request.user;
    return this.watchlistService.getUserWatchlist(
      userId,
      user.sub,
      user.role,
    );
  }

  @ApiOperation({ summary: 'Voir les statistiques d\'un utilisateur (ADMIN uniquement)' })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Statistiques de l\'utilisateur' })
  @ApiResponse({ status: 403, description: 'Accès refusé - Admin requis' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @Get('user/:userId/stats')
  @Roles(Role.ADMIN)
  getUserWatchlistStats(
    @Param('userId') userId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    const user = request.user;
    return this.watchlistService.getWatchlistStats(
      userId,
      user.sub,
      user.role,
    );
  }

  @ApiOperation({ summary: 'Voir toutes les watchlists (ADMIN uniquement)' })
  @ApiResponse({ status: 200, description: 'Toutes les watchlists' })
  @ApiResponse({ status: 403, description: 'Accès refusé - Admin requis' })
  @Get('all')
  @Roles(Role.ADMIN)
  getAllWatchlists(@Req() request: AuthenticatedRequest) {
    const user = request.user;
    return this.watchlistService.getAllWatchlists(user.sub, user.role);
  }

  @ApiOperation({ summary: 'Modifier un élément de sa watchlist' })
  @ApiParam({ name: 'id', description: 'ID de l\'élément de watchlist' })
  @ApiBody({ type: AddToWatchlistDto })
  @ApiResponse({ status: 200, description: 'Élément modifié avec succès' })
  @ApiResponse({ status: 403, description: 'Accès refusé - Vous ne pouvez modifier que votre propre watchlist' })
  @ApiResponse({ status: 404, description: 'Élément non trouvé' })
  @Patch(':id')
  @Roles(Role.USER, Role.ADMIN)
  updateWatchlistItem(
    @Param('id') id: string,
    @Body() updateData: Partial<AddToWatchlistDto>,
    @Req() request: AuthenticatedRequest,
  ) {
    const user = request.user;
    return this.watchlistService.updateWatchlistItem(
      id,
      user.sub,
      user.sub,
      user.role,
      updateData,
    );
  }

  @ApiOperation({ summary: 'Retirer un film de sa watchlist' })
  @ApiParam({ name: 'id', description: 'ID de l\'élément de watchlist' })
  @ApiResponse({ status: 200, description: 'Film retiré de la watchlist' })
  @ApiResponse({ status: 403, description: 'Accès refusé - Vous ne pouvez supprimer que votre propre watchlist' })
  @ApiResponse({ status: 404, description: 'Élément non trouvé' })
  @Delete(':id')
  @Roles(Role.USER, Role.ADMIN)
  removeFromWatchlist(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    const user = request.user;
    return this.watchlistService.removeFromWatchlist(id, user.sub, user.role);
  }
} 