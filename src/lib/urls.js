import lang from './utils/language';

/**
 * @param {string} url containing pathname and search only
 * @return {string} normalized URL
 */
export function normalizeUrl(url) {
  url = url.replace(/\/+/g, '/'); // replace any occurrence of "////" with "/"

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

export function copyLinkToClipboard() {
  if (!('clipboard' in navigator)) {
    return;
  }
  document
    .querySelector('main')
    // ToDo: Use `:is(h2, h3, h4, h5, h6)[id]` once support is better.
    .querySelectorAll('h2[id], h3[id], h4[id], h5[id], h6[id]')
    .forEach((heading) => {
      heading.addEventListener('click', (e) => {
        // Don't jump when the '#' is clicked.
        if (ev.target.nodeName === 'A') {
          ev.preventDefault();
        }
        // Only run once.
        if (heading.dataset.toasted) {
          return;
        }
        try {
          navigator.clipboard.writeText(
            `${location.origin}${location.pathname}#${heading.id}`,
          );
          const temp = heading.innerHTML;
          heading.innerHTML += '&nbsp;<small>(📋 Copied)</small>';
          heading.dataset.toasted = 'toasted';
          setTimeout(() => {
            heading.innerHTML = temp;
            delete heading.dataset.toasted;
          }, 2000);
        } catch (err) {
          console.warn(err.name, err.message);
        }
      });
    });
}
