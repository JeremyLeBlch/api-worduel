import userQueries from "./queries/userQueries";
import userMutations from "./mutations/userMutations";
import gameQueries from "./queries/gameQueries";
import wordQueries from "./queries/wordQueries";
import playerGameSessionQueries from "./queries/playerGamesSessionQueries";
import guessQueries from "./queries/guessQueries";
import guessMutations from "./mutations/guessMutations";
import gameMutations from "./mutations/gameMutations";
import playerGameSessionMutations from "./mutations/playerGameSessionMutations";

// Événements PubSub
const OPPONENT_PROGRESS_EVENT = 'OPPONENT_PROGRESS';
const GAME_STATUS_UPDATED_EVENT = 'GAME_STATUS_UPDATED';

export default {
  Query: {
    ...userQueries,
    ...gameQueries,
    ...wordQueries,
    ...guessQueries,
    ...playerGameSessionQueries,
  },
  Mutation: {
    ...userMutations,
    ...gameMutations,
    ...guessMutations,
    ...playerGameSessionMutations,
  },
  Subscription: {
    opponentProgress: {
      subscribe: (_: any, args: { gameId: string }, { pubSub }: { pubSub: any }) => {
        return pubSub.asyncIterableIterator([`${OPPONENT_PROGRESS_EVENT}_${args.gameId}`]);
      }
    },
    gameStatusUpdated: {
      subscribe: (_: any, args: { gameId: string }, { pubSub }: { pubSub: any }) => {
        return pubSub.asyncIterableIterator([`${GAME_STATUS_UPDATED_EVENT}_${args.gameId}`]);
      }
    }
  }
};
