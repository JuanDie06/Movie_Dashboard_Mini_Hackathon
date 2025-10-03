import { gql } from '@apollo/client';

// Query to fetch authorized sites accessible to the user
export const GET_AUTHORIZED_SITES = gql`
  query GetAuthorizedSites {
    authorizedSites {
      id
      name
      # Add more site fields as needed from GraphiQL exploration:
      # address
      # city
      # state
      # country
      # timezone
      # capacity
    }
  }
`;

