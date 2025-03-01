import { gql } from '@apollo/client';

export const GAME_STATUS_UPDATED = gql`
  subscription GameStatusUpdated($gameId: ID!) {
    gameStatusUpdated(gameId: $gameId) {
      id
      status
      mode
      player_in_game
      
    }
  }
`;