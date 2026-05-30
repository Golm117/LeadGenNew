// lib/sentry.ts — Lightweight Sentry error reporter with env-var seam.
// Sends errors to Sentry's store endpoint when SENTRY_DSN is configured.
// No-ops gracefully when SENTRY_DSN is absent (dev / D-009 env).
// Import only in server-side code ('use server' actions, route handlers).

export async function captureException(error: unknown, context?: Record<string, unknown>): Promise<void> {
  const dsn = process.env.SENTRY_DSN
  if (!dsn) {
    console.error('[sentry dry-run] Exception:', error instanceof Error ? error.message : error, context ?? '')
    return
  }
  // Minimal Sentry envelope format — sufficient for server-side error capture.
  // Full SDK would add breadcrumbs, release, etc. This gives visibility without the SDK weight.
  try {
    const envelope = JSON.stringify({
      level: 'error',
      message: error instanceof Error ? error.message : String(error),
      extra: context,
      timestamp: new Date().toISOString(),
    })
    // Sentry DSN format: https://<key>@<host>/projects/<project-id>
    // Parse DSN to build the envelope endpoint.
    const url = new URL(dsn)
    const projectId = url.pathname.replace('/', '')
    const storeUrl = `${url.protocol}//${url.host}/api/${projectId}/store/`
    await fetch(storeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Sentry-Auth': `Sentry sentry_key=${url.username}, sentry_version=7`,
      },
      body: envelope,
    })
  } catch {
    // Never let Sentry reporting crash the submit path
  }
}
