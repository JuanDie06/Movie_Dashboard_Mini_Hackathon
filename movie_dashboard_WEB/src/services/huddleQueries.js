import { gql } from '@apollo/client';

// Basic query to fetch bookings
// Note: Expand fields based on GraphiQL exploration
export const GET_BOOKINGS = gql`
  query GetBookings(
    $first: Int
    $siteIds: [ID]
  ) {
    bookings(
      first: $first
      siteIds: $siteIds
    ) {
      nodes {
        id
        # Add more fields from SeatOpenBooking type as discovered in GraphiQL
        # Common fields might be: startTime, endTime, status, duration, etc.
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

