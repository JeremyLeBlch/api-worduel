import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/env';
import { prismaClient } from '../prisma/client';
import { MyContext } from '../types/context';

const prisma = prismaClient;

export const authMiddleware = async (resolve, parent, args, context: MyContext, info) => {
  const { req } = context;

  // N'appliquer le middleware qu'aux champs de niveau supérieur (Query et Mutation)
  if (info.parentType.name === 'Query' || info.parentType.name === 'Mutation') {

    const publicMutations = ['login', 'register'];

    const isPublicMutation = info.parentType.name === 'Mutation' && publicMutations.includes(info.fieldName);

    if (isPublicMutation) {
      return resolve(parent, args, context, info);
    }

    const token = req.cookies?.token;

    if (!token) {
      throw new Error('Non authentifié');
    }

    try {
      const decodedToken = jwt.verify(token, SECRET_KEY) as { userId: string };

      const user = await prisma.user.findUnique({
        where: { id: decodedToken.userId },
        include: { authentications: true }
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      context.user = user;

    } catch (error) {
      console.error('Erreur dans authMiddleware:', error);
      throw new Error('Token invalide ou expiré');
    }
  }

  return resolve(parent, args, context, info);
};