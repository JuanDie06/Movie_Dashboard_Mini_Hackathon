import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    // Check for 401 Unauthorized
    if (networkError.statusCode === 401) {
      console.error('❌ Huddle API: 401 Unauthorized - Check API key and permissions');
    }
  }
});

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_HUDDLE_API_URL,
});

// Try multiple authentication methods
// You can switch between these by uncommenting the one you want to test
const authLink = setContext((_, { headers }) => {
  const token = import.meta.env.VITE_HUDDLE_API_KEY;
  
  // Method 1: Bearer token (current)
  return {
    headers: {
      ...headers,
      'Authorization': token ? `Bearer ${token}` : "",
      'Content-Type': 'application/json',
    }
  };
  
  // Method 2: apikey header (uncomment to try)
  // return {
  //   headers: {
  //     ...headers,
  //     'apikey': token,
  //     'Content-Type': 'application/json',
  //   }
  // };
  
  // Method 3: X-API-Key header (uncomment to try)
  // return {
  //   headers: {
  //     ...headers,
  //     'X-API-Key': token,
  //     'Content-Type': 'application/json',
  //   }
  // };
});

export const huddleClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

