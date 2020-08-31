import lang from './utils/language';

/**
 * @param {string} url containing pathname and search only
 * @return {string} normalized URL
 */
export function normalizeUrl(url) {
  const u = new URL(url, window.location.toString());
  let pathname = u.pathname;

  if (pathname.endsWith('/index.html')) {
    // If an internal link refers to "/foo/index.html", strip "index.html" and load.
    pathname = pathname.slice(0, -'index.html'.length);
  } else if (pathname.indexOf('.') !== -1) {
    // Do nothing, cannot handle any link with a loose dot.
  } else if (!pathname.endsWith('/')) {
    // All web.dev pages end with "/".
    pathname = `${pathname}/`;
  }

  return pathname + u.search;
}

export function getCanonicalPath(path) {
  const parts = path.split('/');
  if (parts[1] && lang.isValidLanguage(parts[1])) {
    parts.splice(1, 1);
  }
  return parts.join('/');
}
