import { Role } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
} 