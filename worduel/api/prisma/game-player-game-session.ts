import {Prisma} from '@prisma/client';

export type GameWithPlayerGameSessions = Prisma.GameGetPayload<{
  include: {
    playerGameSessions: true;
  };
}>;