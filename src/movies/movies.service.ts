import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Movie, Prisma } from '@prisma/client';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async createMovie(data: Prisma.MovieCreateInput): Promise<Movie> {
    return this.prisma.movie.create({
      data,
    });
  }

  async findAll(params: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 10, search } = params;
    const skip = limit * (page - 1);

    const where = search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { director: { contains: search, mode: 'insensitive' as const } },
        { genre: { contains: search, mode: 'insensitive' as const } },
      ],
    } : {};

    const [movies, total] = await Promise.all([
      this.prisma.movie.findMany({
        where,
        skip,
        take: limit,
        orderBy: { title: 'asc' },
      }),
      this.prisma.movie.count({ where }),
    ]);

    return {
      movies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Movie> {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException('Film non trouvé');
    }

    return movie;
  }

  async updateMovie(id: string, data: Prisma.MovieUpdateInput): Promise<Movie> {
    await this.findOne(id); // Vérifier que le film existe

    return this.prisma.movie.update({
      where: { id },
      data,
    });
  }

  async deleteMovie(id: string): Promise<void> {
    await this.findOne(id); // Vérifier que le film existe

    await this.prisma.movie.delete({
      where: { id },
    });
  }
} 