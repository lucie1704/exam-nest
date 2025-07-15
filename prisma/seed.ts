import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Supprimer les données existantes
  await prisma.watchlistItem.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.token.deleteMany();
  await prisma.user.deleteMany();

  // Créer les utilisateurs
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
      isActive: true,
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      password: userPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: Role.USER,
      isActive: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      password: userPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: Role.USER,
      isActive: true,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      password: userPassword,
      firstName: 'Bob',
      lastName: 'Johnson',
      role: Role.USER,
      isActive: true,
    },
  });

  console.log('✅ Utilisateurs créés');

  // Créer les films
  const movies = await Promise.all([
    prisma.movie.create({
      data: {
        title: 'Inception',
        description: 'Un voleur qui pénètre dans les rêves des autres pour voler leurs secrets les plus profonds.',
        releaseYear: 2010,
        genre: 'Science-Fiction',
        director: 'Christopher Nolan',
        posterUrl: 'https://example.com/inception.jpg',
      },
    }),
    prisma.movie.create({
      data: {
        title: 'The Dark Knight',
        description: 'Batman face au Joker dans une bataille pour l\'âme de Gotham City.',
        releaseYear: 2008,
        genre: 'Action',
        director: 'Christopher Nolan',
        posterUrl: 'https://example.com/dark-knight.jpg',
      },
    }),
    prisma.movie.create({
      data: {
        title: 'Interstellar',
        description: 'Une équipe d\'explorateurs voyage à travers un trou de ver dans l\'espace.',
        releaseYear: 2014,
        genre: 'Science-Fiction',
        director: 'Christopher Nolan',
        posterUrl: 'https://example.com/interstellar.jpg',
      },
    }),
    prisma.movie.create({
      data: {
        title: 'The Shawshank Redemption',
        description: 'L\'histoire d\'amitié entre deux hommes emprisonnés à Shawshank.',
        releaseYear: 1994,
        genre: 'Drame',
        director: 'Frank Darabont',
        posterUrl: 'https://example.com/shawshank.jpg',
      },
    }),
    prisma.movie.create({
      data: {
        title: 'Pulp Fiction',
        description: 'Plusieurs histoires entrelacées dans le monde du crime de Los Angeles.',
        releaseYear: 1994,
        genre: 'Crime',
        director: 'Quentin Tarantino',
        posterUrl: 'https://example.com/pulp-fiction.jpg',
      },
    }),
    prisma.movie.create({
      data: {
        title: 'The Matrix',
        description: 'Un programmeur découvre que la réalité n\'est qu\'une simulation informatique.',
        releaseYear: 1999,
        genre: 'Science-Fiction',
        director: 'Lana et Lilly Wachowski',
        posterUrl: 'https://example.com/matrix.jpg',
      },
    }),
    prisma.movie.create({
      data: {
        title: 'Forrest Gump',
        description: 'L\'histoire extraordinaire d\'un homme simple qui traverse l\'histoire américaine.',
        releaseYear: 1994,
        genre: 'Drame',
        director: 'Robert Zemeckis',
        posterUrl: 'https://example.com/forrest-gump.jpg',
      },
    }),
    prisma.movie.create({
      data: {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        description: 'Un hobbit doit détruire un anneau maléfique pour sauver la Terre du Milieu.',
        releaseYear: 2001,
        genre: 'Fantasy',
        director: 'Peter Jackson',
        posterUrl: 'https://example.com/lotr.jpg',
      },
    }),
  ]);

  console.log('✅ Films créés');

  // Créer les watchlist items pour différents utilisateurs
  await Promise.all([
    // User 1 (John) - Watchlist complète
    prisma.watchlistItem.create({
      data: {
        userId: user1.id,
        movieId: movies[0].id, // Inception
        status: 'WATCHED',
        rating: 5,
        notes: 'Film incroyable, concept révolutionnaire !',
      },
    }),
    prisma.watchlistItem.create({
      data: {
        userId: user1.id,
        movieId: movies[1].id, // The Dark Knight
        status: 'WANT_TO_WATCH',
        rating: null,
        notes: 'J\'ai entendu que c\'était excellent',
      },
    }),
    prisma.watchlistItem.create({
      data: {
        userId: user1.id,
        movieId: movies[4].id, // Pulp Fiction
        status: 'WATCHED',
        rating: 4,
        notes: 'Tarantino au meilleur de sa forme',
      },
    }),
    
    // User 2 (Jane) - Watchlist différente
    prisma.watchlistItem.create({
      data: {
        userId: user2.id,
        movieId: movies[2].id, // Interstellar
        status: 'WATCHING',
        rating: 4,
        notes: 'En cours de visionnage, très prometteur',
      },
    }),
    prisma.watchlistItem.create({
      data: {
        userId: user2.id,
        movieId: movies[3].id, // Shawshank
        status: 'WATCHED',
        rating: 5,
        notes: 'Un classique absolu',
      },
    }),
    prisma.watchlistItem.create({
      data: {
        userId: user2.id,
        movieId: movies[6].id, // Forrest Gump
        status: 'WANT_TO_WATCH',
        rating: null,
        notes: 'J\'ai envie de voir ce film culte',
      },
    }),
  ]);

  console.log('✅ Watchlist items créés');
  console.log('✅ Seeding terminé !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 