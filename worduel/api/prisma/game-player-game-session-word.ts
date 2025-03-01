import {Prisma} from '@prisma/client';

export type GameWithPlayerGameSessionsAndWord = Prisma.GameGetPayload<{
  include: {
    playerGameSessions: {
      include: {
        user: true;
      };
    };
    word: true;
  };
}>;