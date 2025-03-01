import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation Register($email: String!, $password: String!, $username: String) {
    register(email: $email, password: $password, username: $username) {
      user {
        id
        username
      }
    }
  }
`;