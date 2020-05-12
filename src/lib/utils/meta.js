/**
 * @param {string} name of meta tag to read
 * @return {?string} value or null for no node
 */
export default function getMeta(name) {
  // This doesn't just check <head>, as our partial generation might dump the
  // meta tag into the page content.
  const node = document.querySelector(`meta[name="${name}"]`);
  if (!node) {
    return null;
  }
  return node.getAttribute('content') || node.getAttribute('value');
}
