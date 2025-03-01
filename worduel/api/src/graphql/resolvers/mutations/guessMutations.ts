import PlayerGameSessionDAL from "../../../data/playerGameSession/playerGameSessionDAL";
import GuessService from "../../../service/guess/guess-service";
import Guess from "../../../types/guess";

const guessMutations = {
  makeGuess: async (parent: any, { gameSessionId, wordId, attemptNumber }, { pubSub }) => {
    try {
      const guess = await GuessService.guessWord(gameSessionId, wordId, attemptNumber);
      
      const playerGameSession = await PlayerGameSessionDAL.findPlayerGameSessionById(gameSessionId);
      
      pubSub.publish(`OPPONENT_PROGRESS_${playerGameSession.game_id}`, {
        opponentProgress: {
          playerGameSession: playerGameSession,
          latestGuess: guess
        }
      });

      return guess;
    } catch (e) {
      console.error("Error in makeGuess resolver:", e);
      throw new Error("Failed to make guess");
    }
  }
};

export default guessMutations
