/**
 * Sanitize an HTML string by escaping < and > characters.
 * @param {string} str A string to sanitize
 * @return {string}
 */
export const escapeHtml = (str) => {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

/**
 * Allow a specific tag to be unescaped.
 * @param {string} str A string which has already been escaped
 * @param {string} tag The html tag to allow. E.g. "strong"
 * @return {string}
 */
export const allowHtml = (str, tag) => {
  const open = new RegExp(`&lt;${tag}&gt;`, 'g');
  const close = new RegExp(`&lt;/${tag}&gt;`, 'g');
  return str.replace(open, `<${tag}>`).replace(close, `</${tag}>`);
};
