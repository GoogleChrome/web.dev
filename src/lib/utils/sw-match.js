/**
 * Returns a helper which matches a whole pathname on the Service Worker's host.
 *
 * @param {!RegExp} pathRegexp
 * @return {function({url: !URL}): boolean}
 */
export function matchSameOriginRegExp(pathRegexp) {
  return ({url}) => {
    if (url.host !== self.location.host) {
      return false;
    }
    const m = pathRegexp.exec(url.pathname);
    if (!m) {
      return false;
    }
    return Array.from(m);
  };
}
