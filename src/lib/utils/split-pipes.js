/**
 * @param {string} raw string separated by "|" symbols
 * @return {!Array<string>}
 */
export function splitPipes(raw = '') {
  return raw
    .split(/\|/)
    .map((x) => x.trim())
    .filter(Boolean);
}
