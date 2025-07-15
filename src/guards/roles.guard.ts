import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Role } from '@prisma/client';

// Clé pour stocker les rôles dans les métadonnées
export const ROLES_KEY = 'roles'; 

// Décorateur pour définir les rôles requis pour une méthode
export const Roles = (...roles: Role[]) => {
  return (target: any, key?: string, descriptor?: any) => {
    Reflect.defineMetadata(ROLES_KEY, roles, descriptor.value);
    return descriptor;
  };
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new ForbiddenException('Token manquant');
    }

    try {
      const payload = this.jwtService.verify(token);
      const userRole = payload.role || Role.USER;

      if (!requiredRoles.includes(userRole)) {
        throw new ForbiddenException('Accès refusé. Rôle insuffisant.');
      }

      // Ajouter les informations utilisateur à la requête
      request.user = payload;
      return true;
    } catch (error) {
      throw new ForbiddenException('Token invalide ou expiré');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
} 