import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			user {
				id
				username
				email
			}
		}
	}
`;

export const GET_USER_PROFILE = gql`
	query userQueries {
		me {
			username
			avatar
			primary_color_preference
    		secondary_color_preference
		}
	}
`;
