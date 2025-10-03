function Sites() {
  return (
    <div className="container-app py-8">
      <div className="mb-8">
        <h1 className="heading-section mb-2">Huddle Sites</h1>
        <p className="text-[var(--color-text-muted)]">
          Testing connection to Huddle API
        </p>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold text-[var(--color-text)] mb-4">
          🔧 Configuration Status
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-text-muted)]">API URL:</span>
            <span className="text-[var(--color-text)] font-mono text-xs">
              {import.meta.env.VITE_HUDDLE_API_URL || 'Not configured'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-text-muted)]">Status:</span>
            <span className="text-[var(--color-text)] text-xs">
              {import.meta.env.VITE_HUDDLE_API_KEY ? 'API Key Configured' : 'API Key Not Set'}
            </span>
          </div>
        </div>
      </div>

      <div className="card p-6 mt-6 bg-yellow-900/20 border-yellow-700/50">
        <h3 className="text-lg font-bold text-yellow-400 mb-2">⚠️ Authentication Issue</h3>
        <p className="text-[var(--color-text-muted)] text-sm mb-3">
          Currently unable to authenticate with Huddle API. Please verify your API key.
        </p>
        <details className="text-sm">
          <summary className="cursor-pointer text-[var(--color-text)] mb-2">
            Troubleshooting Steps
          </summary>
          <ol className="list-decimal list-inside space-y-1 text-[var(--color-text-muted)] ml-2">
            <li>Verify API key in .env file is correct</li>
            <li>Check API key is active in Huddle admin console</li>
            <li>Ensure key has proper permissions for GraphQL queries</li>
            <li>Test with GraphiQL: https://huddle.dev.ossd.co/api/base/graphiql</li>
          </ol>
        </details>
      </div>
    </div>
  );
}

export default Sites;
