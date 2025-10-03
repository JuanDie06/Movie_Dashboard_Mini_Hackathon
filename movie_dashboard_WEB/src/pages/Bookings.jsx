import { useQuery, ApolloProvider } from '@apollo/client';
import { Calendar } from 'lucide-react';
import { GET_BOOKINGS } from '../services/huddleQueries';
import { huddleClient } from '../services/huddleClient';

function BookingsContent() {
  const { loading, error, data } = useQuery(GET_BOOKINGS, {
    client: huddleClient,
    variables: { first: 20 },
  });

  if (loading) {
    return (
      <div className="container-app min-h-[60vh] grid place-items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--color-primary)]"></div>
          <div className="text-lg text-[var(--color-text)]">Loading Huddle bookings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-app min-h-[60vh] grid place-items-center">
        <div className="text-center">
          <div className="text-rose-400 text-xl mb-4">Failed to load bookings</div>
          <p className="text-[var(--color-text-muted)] mb-4">{error.message}</p>
          <details className="text-left mt-4 p-4 bg-white/5 rounded-lg">
            <summary className="cursor-pointer text-[var(--color-text)] mb-2">Error Details</summary>
            <pre className="text-xs text-[var(--color-text-muted)] overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  const bookings = data?.bookings?.nodes || [];
  const totalCount = data?.bookings?.totalCount || 0;

  return (
    <div className="container-app py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Calendar size={32} className="text-[var(--color-primary)]" />
          <h1 className="heading-section">Huddle Bookings</h1>
        </div>
        <p className="text-[var(--color-text-muted)]">
          Viewing {bookings.length} of {totalCount} total bookings from Huddle API
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--color-text-muted)] text-lg">No bookings found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={20} className="text-[var(--color-primary)]" />
                  <h3 className="font-bold text-[var(--color-text)]">Booking</h3>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-[var(--color-text-muted)]">ID:</span>
                  <span className="ml-2 text-[var(--color-text)] font-mono text-xs">
                    {booking.id}
                  </span>
                </div>
                {/* Add more fields here as they're discovered in GraphiQL */}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Debug info - can be removed later */}
      <details className="mt-8 p-4 bg-white/5 rounded-lg">
        <summary className="cursor-pointer text-[var(--color-text-muted)] text-sm">
          Debug: Raw GraphQL Response
        </summary>
        <pre className="mt-4 text-xs text-[var(--color-text-muted)] overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
    </div>
  );
}

// Wrapper component with ApolloProvider
function Bookings() {
  return (
    <ApolloProvider client={huddleClient}>
      <BookingsContent />
    </ApolloProvider>
  );
}

export default Bookings;

