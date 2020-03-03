/**
 * Returns a helper which matches a whole pathname on the Service Worker's host.
 *
 * @param {!RegExp} pathRegexp
 * @return {function({url: !URL}): boolean}
 */
export function matchSameOriginRegExp(pathRegexp) {
  return ({url}) =>
    url.host === self.location.host && pathRegexp.test(url.pathname);
}
