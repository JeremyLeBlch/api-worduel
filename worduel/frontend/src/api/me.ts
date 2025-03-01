import { gql } from '@apollo/client';

// Récupérer les infos du profil
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      username
      email
    }
  }
`;

// Mettre à jour l'utilisateur
export const UPDATE_USER = gql`
mutation UpdateUser($avatar: String, $primary_color_preference: String, $secondary_color_preference: String, $username: String) {
  updateUser(avatar: $avatar, username: $username, primary_color_preference: $primary_color_preference, secondary_color_preference: $secondary_color_preference ) {
    id
    username
    email
    avatar
      primary_color_preference
      secondary_color_preference
  }
}
`;

// Récupérer les datas pour en tirer des statistiques
export const GET_STATS_MY_GAME_SESSIONS = gql`
  query GetStatsMyGameSessions {
    statsMyGameSessions {
      id
      mode
      status
      created_at
      started_at
      ended_at
      playerGameSessions {
        id
        user_id
        user {
          id
          username
        }
        score_by_time
        score_by_guesses
        score_bonus
        succeeded
        guesses_count
      }
    }
  }
`;