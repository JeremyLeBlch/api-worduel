import {game_result} from "@prisma/client";

interface IPlayerGameSession {
    id: string;
    gameId: string;
    userId: string;
    scoreByTime: number;
    scoreByGuesses: number;
    scoreBonus: number;
    succeeded: game_result;
    mmrChange: number;
    joinedAt: string;
    guessesCount: number;
    status: string;
    updatedAt: string;
}

export default IPlayerGameSession;