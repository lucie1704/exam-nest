import { Request } from 'express';
import { Role } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
  };
} 