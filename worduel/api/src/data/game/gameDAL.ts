import {prismaClient} from "../../prisma/client";
import {Game} from "@prisma/client";
import IGame from "../../types/game";
import {GameWithPlayerGameSessions} from "../../../prisma/game-player-game-session";
import {GameWithPlayerGameSessionsAndWord} from "../../../prisma/game-player-game-session-word";

const prisma = prismaClient;

const GameDAL = {
    async findGameByIdWithPlayerGameSession(id: string): Promise<Game> {
        return prisma.game.findUnique({where: {id: id,}, include: {playerGameSessions: true}});
    },

    async findGameById(id: string): Promise<Game> {
        return prisma.game.findUnique({where: {id: id,}});
    },


    async findGames(filter?: any, skip?: number, take?: number): Promise<Game[]> {
        const where = filter ? {status: filter.status} : {};
        return prisma.game.findMany({where, skip, take});
    },

    async findGamesPlayerGameSessionsWordsByIds(id: string[]): Promise<GameWithPlayerGameSessionsAndWord[]> {
        return prisma.game.findMany({
            where: {id: {in: id}},
            include: {
                playerGameSessions: {
                    include: {
                        user: true,
                    },
                },
                word: true,
            },
        });
    },

    async findGamesAndPlayerGameSessionsByIds(id: string[]): Promise<GameWithPlayerGameSessions[]> {
        return prisma.game.findMany({
            where: {id: {in: id}},
            include: {
                playerGameSessions: true,
            },
        });
    },

    async findAllGamesAvailable(): Promise<Game[]> {
        return prisma.game.findMany({
            where: {
                status: "waiting",
                max_players: 2,
            },
        });
    },

    async updateGame(game: Partial<IGame>): Promise<any> {
        return prisma.game.update({
            where: {id: game.id},
            data: {
                id: game.id,
                status: game.status,
                mode: game.mode,
                word_id: game.wordId,
                max_players: game.maxPlayers,
                player_in_game: game.playerInGame,
                started_at: game.started_at || new Date().toISOString(),
                ended_at: game.ended_at,
                created_at: game.created_at,
                updated_at: new Date().toISOString(),
            },
        });
    },

    async createGame(game: Partial<IGame>): Promise<Game> {
        const gameDataInsertDb: any =
            {
                max_players: game.maxPlayers,
                mode: game.mode,
                creator_id: game.creatorId,
                word_id: game.wordId,
                player_in_game: game.playerInGame
            }
        return prisma.game.create({data: gameDataInsertDb, include: {playerGameSessions: true}});
    },

    async findGameByGameIdAndUserId(gameId: string, userId: string): Promise<GameWithPlayerGameSessions> {
        return prisma.game.findUnique({
            where: {id: gameId},
            include: {
                playerGameSessions: {
                    where: {user_id: userId},
                },
            },
        });
    },

    async findGameWithPlayerSessions(gameId: string): Promise<GameWithPlayerGameSessions> {
        return prisma.game.findUnique({
            where: { id: gameId },
            include: {
                playerGameSessions: true,
            },
        });
    },

    async updateGameIncludePlayerGameSession(game: Partial<IGame>, user: any): Promise<any> {
        return prisma.game.update({
            where: {id: game.id},
            data: {
                status: game.status,
                mode: game.mode,
                word_id: game.wordId,
                max_players: game.maxPlayers,
                player_in_game: game.playerInGame,
                started_at: game.started_at || new Date().toISOString(),
                ended_at: game.ended_at,
                created_at: game.created_at,
                updated_at: new Date().toISOString(),
            },
            include: {
                word: true,
                creator: true,
                playerGameSessions: {
                    where: {user_id: user.id},
                },
            },
        });
    }
};

export default GameDAL;