import { gql } from '@apollo/client';

export const GET_WORDS = gql`
  query GetWords {
    words(filter: { word_text: "" }, take: 50000) {
      id
      word_text
    }
  }
`;

export const OPPONENT_IN_GAME_QUERY = gql`
  query OpponentInGame($gameId: String!, $playerGameSessionId: String!) {
  opponentInGame(gameId: $gameId, playerGameSessionId: $playerGameSessionId) {
    avatar
    id
    username
    }
  }
`;

export const CREATE_GAME = gql`
  mutation CreateGame($mode: String!) {
    createGame(mode: $mode) {
      game {
        id
        status
        mode
        max_players
        player_in_game
        word {
          id
          word_text
        }
      }
      playerGameSession {
        id
        status
        joined_at
      }
    }
  }
`;


export const START_GAME = gql`
  mutation StartGame($gameId: ID!) {
    startGame(gameId: $gameId) {
      game {
        id
        status
        started_at
        word {
          word_text
        }
      }
      playerGameSession {
        id
        status
        succeeded
        guesses_count
      }
    }
  }
`;

export const CREATE_GAME_DUEL = gql`
  mutation StartGameDuel {
    startGameDuel {
      game {
        id
        status
        mode
        max_players
        player_in_game
      }
      playerGameSession {
        id
        status
        joined_at
      }
    }
  }
`;

export const END_GAME = gql`
  mutation EndGame($gameId: ID!, $result: game_result!) {
    endGame(gameId: $gameId, result: $result) {
      game {
        id
        status
        ended_at
      }
      playerGameSession {
        id
        status
        succeeded
        guesses_count
        updated_at
      }
    }
  }
`;


export const JOIN_GAME = gql`
  mutation JoinGame($gameId: ID!) {
  joinGame(gameId: $gameId) {
    game {
      id
      status
      mode
      max_players
      player_in_game
    }
    playerGameSession {
      id
      status
      joined_at
    }
  }
}
`;

export const MAKE_GUESS = gql`
  mutation MakeGuess($gameSessionId: String!, $wordId: String!, $attemptNumber: Int!) {
    makeGuess(gameSessionId: $gameSessionId, wordId: $wordId, attemptNumber: $attemptNumber) {
      id
      result {
        correct
        positions
      }
    }
  }
`;

export const GET_LEADERBOARD = gql`
query Leaderboard {
  leaderboard {
    avatar
    total_score_multi
    username
  }
}
`;

export const GET_HISTORY = gql`
query MyGameSessions {
  myGameSessions {
    id
    mode
    avatarOpponent
    usernameOpponent
    scoreByTimeMe
    scoreByGuessesMe
    scoreBonusMe
    scoreByTimeOpponent
    scoreByGuessesOpponent
    scoreBonusOpponent
    succeeded
    wordText
    endedAt
  }
}
`;