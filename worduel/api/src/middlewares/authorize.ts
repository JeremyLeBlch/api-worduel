import { ForbiddenError } from 'apollo-server-express';
import { MyContext } from '../types/context';

export const authorize = (requiredRoles: string[]) => {
  return (next) => (root, args, context, info) => {
    const { user } = context;

    if (!user) {
      throw new ForbiddenError('Vous devez être authentifié pour effectuer cette action.');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenError('Vous n\'avez pas les permissions nécessaires pour effectuer cette action.');
    }

    return next(root, args, context, info);
  };
};