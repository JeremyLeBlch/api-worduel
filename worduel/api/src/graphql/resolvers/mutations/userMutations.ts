import AuthService from "../../../service/auth/auth-service";
import UserService from "../../../service/user/user-service";
import { getGraphQLRateLimiter } from 'graphql-rate-limit';
import UserDAL from "../../../data/user/userDAL";
import { prismaClient } from "../../../prisma/client";
import { GraphQLError } from "graphql";
import bcrypt from 'bcryptjs';

const prisma = prismaClient;

const rateLimiter = getGraphQLRateLimiter({
  identifyContext: (ctx) => ctx.ip || 'unknown',
});

const isProduction = process.env.NODE_ENV === 'production';

const userMutations = {
  register: async (parent: any, { email, password, username }) => {
    try {
      const user = await AuthService.registerUser(email, password, username);
      return { user };
    } catch (err: any) {
      if (err.message.includes('Veuillez le lier')) {
        const existingUser = await UserDAL.findUserByEmail(email);
        const googleAuth = await prisma.authentication.findFirst({
          where: {
            user_id: existingUser.id,
            type: 'google',
          },
        });

        if (googleAuth) {
          const userEmail = existingUser.email;
          // Lance une GraphQLError avec l'extension redirectUrl
          throw new GraphQLError(err.message, {
            extensions: {
              code: "REDIRECT",
              redirectUrl: `${process.env.FRONTEND_URL}/confirm-link-google?userId=${existingUser.id}&googleId=${googleAuth.identifier}&email=${encodeURIComponent(userEmail)}`,
            },
          });
        }
      }

      throw new GraphQLError(err.message, {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  },

  login: async (parent: any, { email, password }, context, info) => {
    //le rate limiting
    const errorMessage = await rateLimiter(
      { parent, args: { email, password }, context, info },
      { max: 5, window: '15m', message: 'Trop de tentatives de connexion. Veuillez réessayer plus tard.' }
    );
    if (errorMessage) throw new Error(errorMessage);

    const user = await AuthService.authenticateUser(email, password);
    const token = AuthService.generateToken(user);
    context.res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000,
    });
    return { token, user };
  },

  logout: async (parent, args, { res }) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
    });
    console.log('Cookie token supprimé.');
    return true;
  },

  updateUser: async (parent: any, args: any, { prisma, user }) => {
    if (!user) {
      throw new Error('Non authentifié');
    }

    const updatedUser = await UserService.updateUser(user.id, args, prisma);

    return updatedUser;
  },

  deleteUser: async (parent: any, { password }: { password: string }, { user, res }) => {
    if (!user) {
      throw new GraphQLError('Non authentifié', { extensions: { code: "UNAUTHENTICATED" } });
    }

    const auth = await prisma.authentication.findFirst({
      where: {
        user_id: user.id,
        type: 'email',
      },
    });

    if (!auth || !auth.password_hash) {
      throw new GraphQLError('Impossible de supprimer le compte. Aucune authentification email trouvée.', {
        extensions: { code: "BAD_REQUEST" }
      });
    }

    const valid = await bcrypt.compare(password, auth.password_hash);
    if (!valid) {
      throw new GraphQLError('Mot de passe incorrect', { extensions: { code: "UNAUTHORIZED" } });
    }
    
    await prisma.user.delete({
      where: { id: user.id },
    });

    res.clearCookie('token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
    });

    return true;
  },
};

export default userMutations;