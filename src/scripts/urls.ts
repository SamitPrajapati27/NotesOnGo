/** Normalize links without allowing executable or embedded-document protocols. */
export function normalizeLinkUrl(input: string): string | null {
  const value = input.trim();
  if (!value || /[\u0000-\u0020\u007f]/.test(value)) return null;
  const candidate = /^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(candidate);
    if (!["http:", "https:", "mailto:", "tel:"].includes(url.protocol)) return null;
    if (["http:", "https:"].includes(url.protocol) && (!url.hostname || url.username || url.password)) return null;
    if (["mailto:", "tel:"].includes(url.protocol) && !url.pathname) return null;
    return url.href;
  } catch { return null; }
}
