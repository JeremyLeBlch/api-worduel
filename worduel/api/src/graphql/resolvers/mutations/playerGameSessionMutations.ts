
import PlayerGameSessionService from "../../../service/player-game-session/player-game-session";

const PlayerGameSessionMutations = {
  joinGameWithUser: async (parent: any, gameId: string, userId: string) => {
    return await PlayerGameSessionService.joinGame(gameId, userId);
  },
};

export default PlayerGameSessionMutations;