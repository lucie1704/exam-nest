import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('My Movie List API')
    .setDescription(`
      API de gestion de films et watchlists avec authentification 2FA.

      Fonctionnalités principales :
      - Authentification 2FA sécurisée par email
      - Gestion des films (CRUD) pour les administrateurs
      - Watchlists personnelles pour chaque utilisateur
      - Statistiques de visionnage
      - Système de permissions (USER/ADMIN)

      Authentification :
      Tous les endpoints (sauf /auth/*) nécessitent un token JWT obtenu via l'authentification 2FA.

      Workflow de connexion :
      1. POST /auth/login - Déclenche l'envoi d'un code 2FA
      2. POST /auth/2fa/login - Connexion complète avec le code reçu

      Comptes de test :
      - Admin : admin@example.com / admin123
      - User : john@example.com / password123
    `)
    .setVersion('1.0')
    .addTag('Authentication', 'Endpoints d\'authentification et 2FA')
    .addTag('Movies', 'Gestion des films (CRUD)')
    .addTag('Watchlist', 'Gestion des watchlists personnelles')
    .addTag('Users', 'Gestion des utilisateurs')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Token JWT obtenu après authentification 2FA',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'My Movie List API Documentation',
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
