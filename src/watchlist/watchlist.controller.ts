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
import { WatchlistService } from './watchlist.service';
import { AddToWatchlistDto } from './dto/addToWatchListDto';
import { RolesGuard, Roles } from '../guards';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from '../guards';

@Controller('watchlist')
@UseGuards(RolesGuard)
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

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

  @Get('all')
  @Roles(Role.ADMIN)
  getAllWatchlists(@Req() request: AuthenticatedRequest) {
    const user = request.user;
    return this.watchlistService.getAllWatchlists(user.sub, user.role);
  }

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