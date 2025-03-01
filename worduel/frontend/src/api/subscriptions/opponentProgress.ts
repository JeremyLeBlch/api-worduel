import { gql } from '@apollo/client';

export const OPPONENT_PROGRESS = gql`
  subscription OpponentProgress($gameId: ID!) {
    opponentProgress(gameId: $gameId) {
      playerGameSession {
        id
        user {
          id
          username
          avatar
        }
      }
      latestGuess {
        result {
          correct
          positions
        }
        attempt_number
      }
    }
  }
`;