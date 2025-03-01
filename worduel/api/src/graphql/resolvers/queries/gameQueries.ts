import GameService from "../../../service/game/game-service";

const gameQueries = {
  game: async (_: any, {id}) => {
    return GameService.getGameById(id);
  },
  games: async (_: any, {filter, skip, take}) => {
    return GameService.getGames(filter, skip, take);
  },
};

export default gameQueries;