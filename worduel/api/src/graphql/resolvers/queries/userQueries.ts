import {ForbiddenError} from 'apollo-server-express';
import {authorize} from '../../../middlewares/authorize';
import UserService from "../../../service/user/user-service";

const userQueries = {
  me: async (_: any, args: any, {prisma, user}) => {
    if (!user) {
      throw new Error('Non authentifié');
    }
    return prisma.user.findUnique({
      where: {id: user.id},
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        role: true,
        primary_color_preference: true,
        secondary_color_preference: true,
      },
    });
  },

  user: async (_: any, {id}, {prisma, user}) => {
    if (!user) {
      throw new Error('Non authentifié');
    }

    if (user.id !== id && user.role !== 'ADMIN') {
      throw new ForbiddenError('Accès non autorisé');
    }

    return prisma.user.findUnique({where: {id}});
  },
  users: authorize(['ADMIN'])(async (_: any, {filter, skip, take}, {prisma}) => {
    const where = filter ? {username: {contains: filter.username}} : {};
    return prisma.user.findMany({where, skip, take});
  }),
  leaderboard: async (_: any) => {
    return await UserService.getLeaderboard();
  },
}

export default userQueries;