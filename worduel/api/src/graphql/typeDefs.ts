const typeDefs = `#graphql

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String!
    role: String!
    mmr: Int!
    total_score_multi: Int!
    primary_color_preference: String!
    secondary_color_preference: String!
    created_at: String!
    updated_at: String!
    games_created: [Game!]!
    playerGameSessions: [PlayerGameSession!]!
  }

  type Authentication {
    id: ID!
    user: User
    type: String!
    identifier: String!
    password_hash: String
    created_at: String!
    updated_at: String!
  }

  type Word {
    id: ID!
    word_text: String!
    created_at: String!
    games: [Game!]!
    guesses: [Guess!]!
  }

  type Game {
    id: ID!
    creator: User
    mode: String!
    word: Word
    status: String!
    max_players: Int!
    player_in_game: Int!
    started_at: String
    ended_at: String
    created_at: String!
    updated_at: String!
    playerGameSessions: [PlayerGameSession!]!
  }

  type PlayerGameSession {
    id: ID!
    game: Game
    user: User
    user_id: ID!
    score_by_time: Int!
    score_by_guesses: Int!
    score_bonus: Int!
    succeeded: String!
    mmr_change: Int!
    joined_at: String!
    guesses_count: Int!
    status: String!
    updated_at: String!
    guesses: [Guess!]!
  }

  type Guess {
    id: ID!
    game_session: PlayerGameSession
    word: Word
    attempt_number: Int!
    result: Result!
    created_at: String!
  }

  type Result {
    correct: Boolean!
    positions: [PositionValue!]!
  }

  type OpponentProgressPayload {
  playerGameSession: PlayerGameSession
  latestGuess: LatestGuess
  }

  type LatestGuess {
  result: GuessResult
  attempt_number: Int
  }

  type GuessResult {
    word: String!
    positions: [String!]!
    correct: Boolean!
  }

  enum PositionValue {
    TRUE
    FALSE
    PARTIAL
  }

  enum game_result {
  in_progress
  won
  lost
}

  input UserFilter {
    username: String
  }

  input GameFilter {
    status: String
  }

  input WordFilter {
    word_text: String
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type LogoutResponse {
    message: String!
  }
  
  type GamePayload {
    game: Game!
    playerGameSession: PlayerGameSession
  }
  
  type UserLeaderboard {
    username: String!
    total_score_multi: Int!
    avatar: String!
  }
  
  type HistoryPlayer {
    id: ID!
    mode: String
    avatarOpponent: String
    usernameOpponent: String
    scoreByTimeMe: Int
    scoreByGuessesMe: Int
    scoreBonusMe: Int
    scoreByTimeOpponent: Int
    scoreByGuessesOpponent: Int
    scoreBonusOpponent: Int
    succeeded: String
    wordText: String
    endedAt: String
  }

  type OpponentUser {
    id: String!
    username: String!
    avatar: String!
  }

  type Query {
    me: User
    user(id: ID!): User
    guess(id: ID!): Guess
    users(filter: UserFilter, skip: Int, take: Int): [User!]
    word(id: ID!): Word
    words(filter: WordFilter, skip: Int, take: Int): [Word!]
    randomWord: Word
    game(id: ID!): Game
    games(filter: GameFilter, skip: Int, take: Int): [Game!]
    playerGameSession(id: ID!): PlayerGameSession
    myGameSessions(status: String): [HistoryPlayer!]
    statsMyGameSessions: [Game!]
    guesses(gameSessionId: ID!): [Guess!]
    leaderboard: [UserLeaderboard!]
    opponentInGame(gameId: String!, playerGameSessionId: String!): OpponentUser
  }

  type Mutation {
    register(email: String!, password: String!, username: String): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    logout: Boolean!
    oauthLogin(provider: String!, providerUserId: String!, email: String, username: String, avatar: String): AuthPayload!
    updateUser(username: String, avatar: String, password: String, primary_color_preference: String, secondary_color_preference: String): User!
    createWord(wordText: String!): Word!
    deleteWord(id: ID!): Boolean!
    createGameWithMode(mode: String, creatorId: ID): Game!
    joinGameWithUser(gameId: ID!, userId: ID): PlayerGameSession!
    createGame(mode: String): GamePayload!
    startGame(gameId: ID!): GamePayload!
    endGame(gameId: ID!, result: game_result): GamePayload!
    joinGame(gameId: ID!): PlayerGameSession!
    leaveGame(gameId: ID!): Boolean!
    makeGuess(gameSessionId: String!, wordId: String!, attemptNumber: Int): Guess!
    endGameSession(gameSessionId: ID!): Boolean!
    startGameDuel: GamePayload!
    deleteUser(password: String!): Boolean!
  }

  type Subscription {
  opponentProgress(gameId: ID!): OpponentProgressPayload
  gameStatusUpdated(gameId: ID!): Game
  }
`;

export default typeDefs;
