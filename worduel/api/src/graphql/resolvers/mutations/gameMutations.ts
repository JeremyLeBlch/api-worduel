import wordQueries from "../queries/wordQueries";
import calculateMMRChange from "../../../../utils/mmr";
import GameService from "../../../service/game/game-service";


const gameMutations = {
  createGame: async (parent: any, dto: { mode: "solo" | "duel" }, { user }) => {
    if (!user) throw new Error("Non authentifié");
    try {
      return await GameService.createGame(dto.mode, user.id);
    } catch (e) {
      console.error("Error while creating game:", e);
      throw new Error("Erreur lors de la création de la partie");
    }
  },

  startGame: async (_: any, { gameId }, { prisma, user, pubSub }) => {
    if (!user) throw new Error("Non authentifié");
    try {
      return await GameService.startGame(gameId, user.id, pubSub);
    } catch (error) {
      console.error("Error while starting game:", error);
      throw new Error("Erreur lors du démarrage de la partie");
    }
  },

  startGameDuel: async (_: any, __: any, { pubSub, user }) => {
    if (!user) throw new Error("Non authentifié");
    try {
      return await GameService.startGameDuel(user.id, pubSub);
    } catch (error) {
      console.error("Error while starting duel:", error);
      throw new Error("Erreur lors du démarrage du duel");
    }
  },
  
  joinGame: async (_: any, { gameId }, { pubSub, user }) => {
    if (!user) throw new Error("Non authentifié");
    try {
      return await GameService.joinGame(gameId, user.id, pubSub);
    } catch (error) {
      console.error("Error while joining game:", error);
      throw new Error("Erreur lors de la connexion à la partie");
    }
  },

  leaveGame: async (_: any, { gameId }, { prisma, user }) => {
    if (!user) throw new Error("Non authentifié");
    try {
      return await GameService.leaveGame(gameId, user.id);
    } catch (error) {
      console.error("Error while leaving game:", error);
      throw new Error("Erreur lors de la déconnexion à la partie");
    }
  },

  endGame: async (_: any, { gameId, result }, { prisma, user }) => {
    if (!user) throw new Error("Non authentifié");
    try {
      return await GameService.endGame(gameId, user.id, result);
    } catch (error) {
      console.error("Error while ending game:", error);
      throw new Error("Erreur lors de la fin de la partie");
    }
  }
};

export default gameMutations
