import { Request } from 'express';
import { JwtPayload } from './jwt.types';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
} 