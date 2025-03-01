import { prismaClient } from "../../prisma/client";
import { Game, PlayerGameSession } from "@prisma/client";
import IPlayerGameSession from "../../types/playerGameSession";

const prisma = prismaClient;

const PlayerGameSessionDAL = {
  async findPlayerGameSessionById(id: string): Promise<PlayerGameSession> {
    return prisma.playerGameSession.findUnique({ where: { id: id } });
  },

  async createPlayerGameSession(gameId: string, userId: string): Promise<PlayerGameSession> {
    return prisma.playerGameSession.create({
      data: { game_id: gameId, user_id: userId },
      include: { game: true, user: true }
    });
  },

  async updatePlayerGameSession(data: Partial<IPlayerGameSession>): Promise<PlayerGameSession> {
    return prisma.playerGameSession.update({
      where: { id: data.id },
      data: {
        score_by_time: data.scoreByTime,
        score_by_guesses: data.scoreByGuesses,
        score_bonus: data.scoreBonus,
        succeeded: data.succeeded,
        mmr_change: data.mmrChange,
        joined_at: data.joinedAt,
        guesses_count: data.guessesCount,
        status: data.status,
        updated_at: data.updatedAt,
      },
    });
  },

  async findGuessesBySessionId(sessionId: string) {
    return prisma.guess.findMany({
      where: { game_session_id: sessionId },
    });
  },

  async findPlayerGameSessionByGameIdAndUserId(gameId: string, userId: string): Promise<PlayerGameSession> {
    return prisma.playerGameSession.findFirst({
      where: {
        user_id: userId,
        game_id: gameId,
      },
    });
  },

  async deletePLayerGameSession(id: string): Promise<PlayerGameSession> {
    return prisma.playerGameSession.delete({
      where: { id: id },
    });
  },

  async getPlayerGameSessionByUserId(userId: string): Promise<PlayerGameSession[]> {
    const result = await prisma.playerGameSession.findMany({
      where: {
        user_id: userId,
      },
    });
    return result;
  },

  async findPlayerGameSessionsByGameId(gameId: string): Promise<PlayerGameSession[]> {
    return prisma.playerGameSession.findMany({
      where: { game_id: gameId },
    });
  },
  async findOpponentInGame(gameId: string, currentPlayerGameSessionId: string) {
    // Récupérer toutes les sessions de jeu pour ce jeu
    const playerGameSessions = await prisma.playerGameSession.findMany({
      where: {
        game_id: gameId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    });

    // Trouver la session de l'adversaire (celle qui n'est pas la session courante)
    const opponentSession = playerGameSessions.find(
      session => session.id !== currentPlayerGameSessionId
    );

    // Retourner les informations de l'utilisateur adversaire
    return opponentSession?.user || null;
  }
};

export default PlayerGameSessionDAL;