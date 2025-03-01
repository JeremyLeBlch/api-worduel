import GameDAL from "../../data/game/gameDAL";
import IGame from "../../types/game";
import wordDAL from "../../data/word/wordDAL";
import PlayerGameSessionDAL from "../../data/playerGameSession/playerGameSessionDAL";
import {Game, game_result, PlayerGameSession} from "@prisma/client";
import {PubSubEngine} from 'graphql-subscriptions';

const GAME_STATUS_UPDATED_EVENT = 'GAME_STATUS_UPDATED';

const GameService = {

    async getGameById(id: string) {
        return await GameDAL.findGameByIdWithPlayerGameSession(id);
    },

    async getGames(filter: any, skip: number, take: number) {
        return await GameDAL.findGames(filter, skip, take);
    },

    async startGameDuel(userId: string, pubSub: PubSubEngine) {
        const allGamesDuelAvailable = await GameDAL.findAllGamesAvailable();
        if (allGamesDuelAvailable.length === 0) {
            const newGamePayload = await GameService.createGame("duel", userId);

            //event publish
            await pubSub.publish(`GAME_STATUS_UPDATED_${newGamePayload.game.id}`, {
                gameStatusUpdated: newGamePayload.game, // Envoi de l'objet complet Game
            });
            return newGamePayload;
        } else {
            const gameToJoin = allGamesDuelAvailable[0];
            console.log("userId", userId);
            const joinedGame = await GameService.joinGame(gameToJoin.id, userId, pubSub);
            try {
                const updatedGame = await GameDAL.updateGame({id: gameToJoin.id, status: "in_progress"});
                //event publish
                await pubSub.publish(`GAME_STATUS_UPDATED_${updatedGame.id}`, {
                    gameStatusUpdated: updatedGame, // Envoi de l'objet complet Game
                });
            } catch (error) {
                console.error("Erreur lors de la mise à jour du statut de la partie :", error);
                throw new Error("Erreur lors de la mise à jour du statut de la partie");
            }
            console.log("joinedGame", joinedGame);
            return joinedGame;
        }
    },

    async createGame(mode: string, creatorId: string): Promise<{ game: Game, playerGameSession: PlayerGameSession }> {
        const randomWord = await wordDAL.getRandomWord();

        const game: IGame = {
            mode: mode === "solo" ? "solo" : "duel",
            creatorId: creatorId,
            maxPlayers: mode === "solo" ? 1 : 2, // Assurez-vous que ceci correspond au modèle Prisma
            wordId: randomWord.id,
            status: "waiting",
            playerInGame: 1
        };

        const gameCreated = await GameDAL.createGame(game);
        const gameSession = await PlayerGameSessionDAL.createPlayerGameSession(gameCreated.id, gameCreated.creator_id);
        const gameFound = await GameDAL.findGameByIdWithPlayerGameSession(gameCreated.id);
        return {
            game: gameFound,
            playerGameSession: gameSession,
        };
    },

    async startGame(gameId: string, userId: string, pubSub: PubSubEngine): Promise<any> {
        const gameStart = {
            id: gameId,
            status: "in_progress" as "in_progress",
        }
        const gameUpdated = await GameDAL.updateGameIncludePlayerGameSession(gameStart, userId);
        const gameSession = gameUpdated.playerGameSessions[0];
        if (!gameSession) throw new Error("Session de jeu introuvable pour cet utilisateur");

        // Publier l'événement de mise à jour du statut du jeu
        await pubSub.publish(`GAME_STATUS_UPDATED_${gameUpdated.id}`, {
            gameStatusUpdated: gameUpdated,
        });

        return {
            game: gameUpdated,
            playerGameSession: gameSession,
        };
    },

    async joinGame(gameId: string, userId: string, pubSub: PubSubEngine): Promise<{
        game: Game,
        playerGameSession: PlayerGameSession
    }> {
        const game = await GameDAL.findGameById(gameId);

        // Vérifier si une session existe déjà
        const existingSession = await PlayerGameSessionDAL.findPlayerGameSessionByGameIdAndUserId(gameId, userId);
        if (existingSession) {
            return {
                game: game,
                playerGameSession: existingSession,
            };
        }

        // Créer une nouvelle session et incrémenter le compteur de joueurs
        const playerGameSession = await PlayerGameSessionDAL.createPlayerGameSession(gameId, userId);


        // Incrémenter player_in_game
        game.player_in_game = (game.player_in_game || 0) + 1;
        await GameDAL.updateGame({
            id: gameId,
            playerInGame: game.player_in_game
        });

        // Publier l'événement de mise à jour
        await pubSub.publish(`GAME_STATUS_UPDATED_${game.id}`, {
            gameStatusUpdated: game,
        });
        console.log("game join", game);
        console.log("player game session join", playerGameSession);
        return {
            game: game,
            playerGameSession: playerGameSession,
        }
    },

    async leaveGame(gameId: string, userId: string) {
        const existingSession = await PlayerGameSessionDAL.findPlayerGameSessionByGameIdAndUserId(gameId, userId);
        if (!existingSession) throw new Error("Session de jeu introuvable");
        await PlayerGameSessionDAL.deletePLayerGameSession(existingSession.id);
        return await GameDAL.updateGameIncludePlayerGameSession({playerInGame: 1, status: "cancelled"}, userId);
    },

    async endGame(gameId: string, userId: string, result?: game_result) {
        try {
            const game = await GameDAL.findGameWithPlayerSessions(gameId);
            if (!game) throw new Error("Partie introuvable");
            if (game.status !== "in_progress") throw new Error("La partie n'est pas en cours");

            const updatedGame = await GameDAL.updateGame({
                id: gameId,
                status: "completed",
                ended_at: new Date().toISOString(),
            });

            const playerGameSessions = game.playerGameSessions;
            if (!playerGameSessions[0]) throw new Error("Session de jeu introuvable");

            const updatedSessions = []
            if (result) {
                for (let i = 0; i < playerGameSessions.length; i++) {
                    const guesses = await PlayerGameSessionDAL.findGuessesBySessionId(playerGameSessions[i].id);
                    const guessesCount = guesses.length;
                    let sessionResult: game_result;
                    if (playerGameSessions[i].user_id === userId) {
                        sessionResult = result;
                    } else {
                        sessionResult = result === "lost" ? "won" : "lost";
                    }
                    const updatedSession = await PlayerGameSessionDAL.updatePlayerGameSession({
                        id: playerGameSessions[i].id,
                        succeeded: sessionResult,
                        status: "completed",
                        guessesCount: guessesCount,
                        updatedAt: new Date().toISOString(),
                    });
                    updatedSessions.push(updatedSession);
                }
            } else {
                for (let i = 0; i < playerGameSessions.length; i++) {
                    const guesses = await PlayerGameSessionDAL.findGuessesBySessionId(playerGameSessions[i].id);
                    const guessesCount = guesses.length;
                    const updatedSession = await PlayerGameSessionDAL.updatePlayerGameSession({
                        id: playerGameSessions[i].id,
                        succeeded: "draw",
                        status: "completed",
                        guessesCount: guessesCount,
                        updatedAt: new Date().toISOString(),
                    });
                    updatedSessions.push(updatedSession);
                }
            }

            return {
                game: updatedGame,
                gameSessions: updatedSessions,
            };

        } catch (error) {
            console.error("Erreur lors de la fin de la partie :", error);
            throw new Error("Erreur lors de la fin de la partie");
        }
    }
}

export default GameService;