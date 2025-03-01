import PlayerGameSessionDAL from "../../data/playerGameSession/playerGameSessionDAL";
import GameDAL from "../../data/game/gameDAL";
import HistoryPlayer from "../../types/historyPlayer";
import { prismaClient } from "../../prisma/client";

const prisma = prismaClient;

export const PlayerGameSessionService = {
  async joinGame(gameId: string, userId: string) {
    await PlayerGameSessionDAL.createPlayerGameSession(gameId, userId);
  },

  async getHistoryGames(userId: string) {
    const result = await PlayerGameSessionDAL.getPlayerGameSessionByUserId(userId);

    const gameIds = result.map(session => session.game_id);

    const games = await GameDAL.findGamesPlayerGameSessionsWordsByIds(gameIds);

    return games.map(game => {
      const meSession = game.playerGameSessions.find(session => session.user_id === userId);
      console.log(meSession);
      const opponentSession = game.playerGameSessions.find(session => session.user_id !== userId);

      const history = new HistoryPlayer({
        id: game.id,
        mode: game.mode,
        avatarOpponent: opponentSession?.user?.avatar ?? "default.png",
        usernameOpponent: opponentSession?.user?.username ?? "anonymous",
        scoreByTimeMe: meSession?.score_by_time ?? 0,
        scoreByGuessesMe: meSession?.score_by_guesses ?? 0,
        scoreBonusMe: meSession?.score_bonus ?? 0,
        scoreByTimeOpponent: opponentSession?.score_by_time ?? 0,
        scoreByGuessesOpponent: opponentSession?.score_by_guesses ?? 0,
        scoreBonusOpponent: opponentSession?.score_bonus ?? 0,
        succeeded: meSession?.succeeded ?? "unknown",
        wordText: game.word?.word_text ?? "unknown",
        endedAt: game.ended_at ?? "unknown",
      });
      return history;
    });
  },
  async getStatsGames(userId: string) {
    const gamesSessions = await prisma.playerGameSession.findMany({
      where: { user_id: userId },
      include: {
        game: true,
        user: true,
      },
    });
    const gameIds = gamesSessions.map((session) => session.game_id);
    return await prisma.game.findMany({
      where: { id: { in: gameIds } },
      include: {
        playerGameSessions: {
          include: { user: true },
        },
      },
    });
  },
  async getOpponentInGame(gameId: string, currentPlayerGameSessionId: string) {
    return await PlayerGameSessionDAL.findOpponentInGame(gameId, currentPlayerGameSessionId);
  }
}

export default PlayerGameSessionService;