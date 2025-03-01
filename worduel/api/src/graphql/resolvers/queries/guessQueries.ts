import GuessService from "../../../service/guess/guess-service";

const guessQueries = {
    guesses: async (_: any,) => {
      return await GuessService.getGuesses();
    },

    guess: async (parent: any, { id }) => {
      return await GuessService.getGuessById(id);
    }
  };
  export default guessQueries;