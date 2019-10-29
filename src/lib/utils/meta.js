/**
 * @param {string} name of meta tag to read
 * @param {!HTMLDocument=} target to read from
 * @return {?string} value or null for no node
 */
export default function getMeta(name, target = document) {
  const node = target.head.querySelector(`meta[name="${name}"]`);
  if (!node) {
    return null;
  }
  return node.getAttribute("content") || node.getAttribute("value");
}
