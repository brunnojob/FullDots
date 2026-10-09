// Browser origin checks shared by the HTTP API and the computer stream.
const LOOPBACK = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

function parse(value: string): URL | undefined {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
        url.pathname !== '/' || url.search || url.hash) return undefined;
    return url;
  } catch {
    return undefined;
  }
}

/**
 * Whether a browser `Origin` may call the API. It must match the configured app origin, or the
 * request's own origin when none is configured. `localhost`, `127.0.0.1` and `[::1]` name the same
 * machine, so a loopback origin is also accepted for a loopback app origin with the same scheme and
 * port. A page from any other site can never present a loopback origin.
 */
export function originAllowed(
  requestOrigin: string,
  expectedOrigin: string,
): boolean {
  const offered = parse(requestOrigin);
  const expected = parse(expectedOrigin);
  if (offered && expected && offered.origin === expected.origin) return true;
  return !!(
    offered &&
    expected &&
    LOOPBACK.has(offered.hostname) &&
    LOOPBACK.has(expected.hostname) &&
    offered.protocol === expected.protocol &&
    offered.port === expected.port
  );
}
