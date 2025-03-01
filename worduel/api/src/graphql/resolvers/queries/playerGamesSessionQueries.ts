import PlayerGameSessionService from "../../../service/player-game-session/player-game-session";
import PlayerGameSessionDAL from "../../../data/playerGameSession/playerGameSessionDAL";

const playerGameSessionQueries = {
  playerGameSession: async (_: any, { id }, { prisma }) => {
    return prisma.playerGameSession.findUnique({
      where: { id },
      include: { game: true, user: true, guesses: true },
    });
  },
  myGameSessions: async (_: any, { }, { prisma, user }) => {
    if (!user) throw new Error('Non authentifié');
    try {
      return await PlayerGameSessionService.getHistoryGames(user.id);
    } catch (e) {
      console.error(e);
    }
  },
  statsMyGameSessions: async (_: any, { }, { prisma, user }) => {
    if (!user) throw new Error('Non authentifié');
    try {
      return await PlayerGameSessionService.getStatsGames(user.id);
    } catch (e) {
      console.error(e);
    }
  },
  opponentInGame: async (_: any, { gameId, playerGameSessionId }, { prisma, user }) => {
    if (!user) throw new Error('Non authentifié');
    try {
      // Pas besoin de refaire une requête pour trouver la session, 
      // on utilise directement le playerGameSessionId fourni
      return await PlayerGameSessionService.getOpponentInGame(
        gameId,
        playerGameSessionId
      );
    } catch (e) {
      console.error(e);
      throw new Error('Erreur lors de la récupération de l\'adversaire');
    }
  },
};

export default playerGameSessionQueries;