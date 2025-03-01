import GameDAL from "../../data/game/gameDAL";
import WordDAL from "../../data/word/wordDAL";
import GuessDAL from "../../data/guess/guessDAL";
import PlayerGameSessionDAL from "../../data/playerGameSession/playerGameSessionDAL";
import { Guess } from "@prisma/client";
import { PositionValue } from "../../types/guess";

const GuessService = {
  async getGuessById(id: string): Promise<Guess> {
    return await GuessDAL.findGuessById(id);
  },

  async getGuesses(): Promise<Guess[]> {
    return await GuessDAL.findGuesses();
  },

  async guessWord(gameSessionId: string, wordId: string, attemptNumber: number): Promise<Guess> {
    const guessWord = await WordDAL.findWordById(wordId);
    const gameSession = await PlayerGameSessionDAL.findPlayerGameSessionById(gameSessionId);
    const game = await GameDAL.findGameByIdWithPlayerGameSession(gameSession.game_id);
    const wordToFoundId = game.word_id;
    const wordToFound = await WordDAL.findWordById(wordToFoundId);

    const guessLetters = guessWord.word_text.split("");
    const targetLetters = wordToFound.word_text.split("");

    let positions: PositionValue[] = ['FALSE', 'FALSE', 'FALSE', 'FALSE', 'FALSE'];
    let targetLetterUsage: boolean[] = [false, false, false, false, false];

    // Premier passage : lettres correctes à la bonne position
    for (let i = 0; i < guessLetters.length; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        positions[i] = 'TRUE';
        targetLetterUsage[i] = true;
      }
    }

    // Deuxième passage : lettres correctes à la mauvaise position
    for (let i = 0; i < guessLetters.length; i++) {
      if (positions[i] === 'FALSE') {
        for (let j = 0; j < targetLetters.length; j++) {
          if (!targetLetterUsage[j] && guessLetters[i] === targetLetters[j]) {
            positions[i] = 'PARTIAL';
            targetLetterUsage[j] = true;
            break;
          }
        }
      }
    }

    const isCorrect = positions.every(pos => pos === 'TRUE');

    const guess = await GuessDAL.createGuess(gameSessionId, wordId, attemptNumber, isCorrect, positions);
    return guess;
  }
}

export default GuessService;