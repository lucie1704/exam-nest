import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { WatchlistItem, Prisma, Role } from '@prisma/client';

@Injectable()
export class WatchlistService {
  constructor(private prisma: PrismaService) {}

  async addToWatchlist(userId: string, movieId: string, data?: Partial<WatchlistItem>) {
    // Vérifier que le film existe
    await this.prisma.movie.findUniqueOrThrow({
      where: { id: movieId },
    });

    return this.prisma.watchlistItem.upsert({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
      update: data || {},
      create: {
        userId,
        movieId,
        ...(data || {}),
      },
      include: {
        movie: true,
      },
    });
  }

  async getUserWatchlist(userId: string, currentUserId: string, userRole: Role) {
    // Vérifier les permissions
    if (userRole !== Role.ADMIN && userId !== currentUserId) {
      throw new ForbiddenException('Vous ne pouvez voir que votre propre watchlist');
    }

    return this.prisma.watchlistItem.findMany({
      where: { userId },
      include: {
        movie: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllWatchlists(currentUserId: string, userRole: Role) {
    if (userRole !== Role.ADMIN) {
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }

    return this.prisma.watchlistItem.findMany({
      include: {
        movie: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: [
        { user: { firstName: 'asc' } },
        { createdAt: 'desc' },
      ],
    });
  }

  async updateWatchlistItem(
    itemId: string,
    userId: string,
    currentUserId: string,
    userRole: Role,
    data: Partial<WatchlistItem>,
  ) {
    const item = await this.prisma.watchlistItem.findUnique({
      where: { id: itemId },
      include: { user: true },
    });

    if (!item) {
      throw new NotFoundException('Élément de watchlist non trouvé');
    }

    // Vérifier les permissions
    if (userRole !== Role.ADMIN && item.userId !== currentUserId) {
      throw new ForbiddenException('Vous ne pouvez modifier que votre propre watchlist');
    }

    return this.prisma.watchlistItem.update({
      where: { id: itemId },
      data,
      include: {
        movie: true,
      },
    });
  }

  async removeFromWatchlist(
    itemId: string,
    currentUserId: string,
    userRole: Role,
  ) {
    const item = await this.prisma.watchlistItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Élément de watchlist non trouvé');
    }

    // Vérifier les permissions
    if (userRole !== Role.ADMIN && item.userId !== currentUserId) {
      throw new ForbiddenException('Vous ne pouvez supprimer que votre propre watchlist');
    }

    await this.prisma.watchlistItem.delete({
      where: { id: itemId },
    });

    return { message: 'Film retiré de la watchlist' };
  }

  async getWatchlistStats(userId: string, currentUserId: string, userRole: Role) {
    // Vérifier les permissions
    if (userRole !== Role.ADMIN && userId !== currentUserId) {
      throw new ForbiddenException('Vous ne pouvez voir que vos propres statistiques');
    }

    const stats = await this.prisma.watchlistItem.groupBy({
      by: ['status'],
      where: { userId },
      _count: {
        status: true,
      },
    });

    const total = await this.prisma.watchlistItem.count({
      where: { userId },
    });

    const averageRating = await this.prisma.watchlistItem.aggregate({
      where: {
        userId,
        rating: { not: null },
      },
      _avg: {
        rating: true,
      },
    });

    return {
      total,
      averageRating: averageRating._avg.rating || 0,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat.status] = stat._count.status;
        return acc;
      }, {} as Record<string, number>),
    };
  }
} 