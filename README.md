# My Movie List API

**Développé par :** Lucie GODARD

## 📋 Description

API REST développée avec NestJS permettant la gestion de films et de watchlists personnelles avec un système d'authentification 2FA sécurisé.

## Fonctionnalités principales

- **Authentification 2FA** par email avec JWT
- **Gestion des films** (CRUD) pour les administrateurs
- **Watchlists personnelles** pour chaque utilisateur
- **Système de rôles** (USER/ADMIN) avec permissions
- **Statistiques** de visionnage
- **Documentation Swagger** interactive

## Technologies utilisées

- **Backend :** NestJS, TypeScript, Prisma
- **Base de données :** PostgreSQL
- **Authentification :** JWT, 2FA par email
- **Email :** MailHog (développement)
- **Documentation :** Swagger/OpenAPI

## Installation et démarrage

```bash
# Cloner le repository
git clone [URL_DU_REPO]

# Installer les dépendances
npm install

# Configurer la base de données
docker-compose up -d

# Lancer les migrations
npx prisma migrate dev

# Seeder la base de données
npx prisma db seed

# Démarrer l'application
npm run start:dev
```

## Documentation

- **API Documentation :** http://localhost:3000/api
- **MailHog (emails) :** http://localhost:8025

## Comptes de test

- **Admin :** admin@example.com / admin123
- **User :** john@example.com / password123

## Workflow d'authentification

1. Connexion → Envoi d'un code 2FA par email
2. Vérification du code → Obtention d'un token JWT
3. Utilisation du token pour accéder aux endpoints protégés

## Structure du projet

```
src/
├── auth/          # Authentification 2FA
├── movies/        # Gestion des films
├── watchlist/     # Watchlists personnelles
├── users/         # Gestion des utilisateurs
├── guards/        # Guards d'autorisation
└── types/         # Types TypeScript
```

## Endpoints principaux

- `POST /auth/login` - Connexion (déclenche 2FA)
- `POST /auth/2fa/login` - Connexion complète
- `GET /movies` - Lister les films
- `POST /watchlist` - Ajouter à sa watchlist
- `GET /watchlist/my` - Voir sa watchlist
