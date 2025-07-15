import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  // Supprimer les données existantes
  await prisma.token.deleteMany();
  await prisma.user.deleteMany();

  // Créer des utilisateurs de test
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        firstName: 'Admin',
        lastName: 'User',
        birthDate: new Date('1990-01-01'),
        role: 'ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'John',
        lastName: 'Doe',
        birthDate: new Date('1995-05-15'),
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'Jane',
        lastName: 'Smith',
        birthDate: new Date('1992-08-20'),
        role: 'USER',
      },
    }),
  ]);

  console.log('✅ Users created:', users.length);

  console.log('🎉 Seeding completed!');
  console.log('\n📋 Test accounts:');
  console.log('Admin: admin@example.com / admin123');
  console.log('User 1: john@example.com / password123');
  console.log('User 2: jane@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 