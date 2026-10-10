const LOOPBACK = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

function parse(value: string): URL | undefined {
  try {
    const url = new URL(value);
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.pathname !== '/' ||
      url.search ||
      url.hash
    )
      return undefined;
    return url;
  } catch {
    return undefined;
  }
}

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
