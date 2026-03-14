import { User } from '../users/entities/user.entity';
import { type AuthenticatedUser } from './interfaces/auth.types';

export function toAuthenticatedUser(user: User): AuthenticatedUser {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
}
