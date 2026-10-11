/**
 * Build a note route with a URL-encoded ID.
 */
export function notePath(id: string): string {
  return `/notes/${encodeURIComponent(id)}`;
}

/**
 * Decode the ID from a note route, returning null for an unmatched or malformed path.
 */
export function noteIdFromPath(path: string): string | null {
  const match = /^\/notes\/([^/]+)\/?$/.exec(path);
  if (!match) return null;
  try { return decodeURIComponent(match[1]); }
  catch { return null; }
}
