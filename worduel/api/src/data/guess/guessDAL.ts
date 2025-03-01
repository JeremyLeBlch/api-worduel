import {prismaClient} from "../../prisma/client";
import {Guess} from "@prisma/client";
import {PositionValue} from "../../types/guess";

const prisma = prismaClient;

const GuessDAL = {
  async findGuessById(id: string): Promise<Guess> {
    return prisma.guess.findUnique({where: {id: id,}});
  },

  async findGuesses(): Promise<Guess[]> {
    return prisma.guess.findMany();
  },

  async createGuess(gameSessionId: string, wordId: string, attemptNumber: number, correct: boolean, positions: PositionValue[]): Promise<Guess> {
    const guess = await prisma.guess.create({
      data: {
        game_session_id: gameSessionId,
        word_id: wordId,
        attempt_number: attemptNumber,
        result: {correct: correct, positions: positions},
      }
    });
    return guess;
  },
};

export default GuessDAL;
