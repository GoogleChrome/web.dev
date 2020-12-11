import './abort-controller-polyfill';
import {addPageToContentIndex} from '../content-indexing';
import {trackError} from '../analytics';

let globalHandler;
let recentActiveUrl; // current URL not including hash

/**
 * @return {string} URL pathname plus optional search part
 */
function getUrl() {
  return window.location.pathname + window.location.search;
}

/**
 * The caller wants to change the active URL. Let them, without triggering any
 * new loads.
 */
function onReplaceState() {
  recentActiveUrl = getUrl();
}

/**
 * The user has gone forward or back in the stack. Reload new content, or do
 * nothing if it was just a hash change.
 */
function onPopState() {
  const updatedUrl = getUrl();
  if (recentActiveUrl === updatedUrl) {
    // This was just a change in hash. Do nothing and let the browser run its
    // own behavior.
    return;
  }
  recentActiveUrl = updatedUrl;
  globalHandler();
}

/**
 * @param {string} hash to scroll to
 */
function scrollToHashOrTop(hash) {
  // Since we're loading this page dynamically, look for the target hash-ed
  // element (if any) and scroll to it.
  if (hash.startsWith('#')) {
    hash = hash.substr(1);
  }
  if (hash) {
    const target = document.getElementById(hash);
    if (target) {
      target.scrollIntoView();
      return;
    }
  }
  document.documentElement.scrollTop = 0;
}

/**
 * Click handler that intercepts potential URL changes via <a href="...">.
 *
 * @param {!MouseEvent} e
 */
function onClick(e) {
  if (
    e.ctrlKey ||
    e.metaKey ||
    e.altKey ||
    e.shiftKey ||
    e.button ||
    e.defaultPrevented
  ) {
    return;
  }

  if (!(e.target instanceof HTMLElement)) {
    return;
  }

  // nb. If this ever supports Shadow DOM, we can use .composedPath to find
  // the nearest link inside an open Shadow Root.
  const link = /** @type {!HTMLAnchorElement} */ (e.target.closest('a[href]'));
  if (
    !link ||
    link.target ||
    link.host !== location.host ||
    link.pathname.match(/\.(jpg|png|gif|svg|webp)$/)
  ) {
    return;
  }

  if (route(link.href)) {
    e.preventDefault();
  }
}

/**
 * Exports the 'default' listener function. This is a let so we can change it
 * after it has been called once.
 *
 * @param {function(!Object): ?} handler which returns an optional Promise
 */
export let listen = defaultListen;

/**
 * Adds global page listeners for SPA routing.
 *
 * @param {function(!Object): ?} handler which returns an optional Promise
 */
function defaultListen(handler) {
  if (!handler) {
    throw new Error('need handler');
  }
  listen = () => {
    throw new Error('listen can only be called once');
  };

  let previousController = null;

  globalHandler = (url, hash) => {
    const isNavigation = Boolean(url);
    if (!isNavigation) {
      url = getUrl();
      hash = window.location.hash;
    }

    const firstRun = previousController === null;
    if (!firstRun) {
      previousController.abort();
    }

    const controller = (previousController = new AbortController());
    const currentState = isNavigation ? null : window.history.state;

    // Pass ready() to handler. It can be invoked early by router users to replace the current URL,
    // e.g. for navigation, and to push state. Otherwise, it's called automatically at completion.
    let readyRun = false;
    const ready = (url, state) => {
      if (controller.signal.aborted || readyRun) {
        return false;
      }
      readyRun = true;

      const update = url + hash;
      if (isNavigation) {
        window.history.pushState(state, null, update);
      } else {
        window.history.replaceState(state, null, update);
      }
      recentActiveUrl = url;
    };

    const arg = {
      firstRun,
      url,
      signal: controller.signal,
      ready,
      state: currentState,
    };
    return Promise.resolve(handler(arg))
      .then(() => {
        ready(url, currentState); // skipped if already run
        return controller.signal.aborted;
      })
      .catch((err) => {
        // Only throw errors if not preempted and not the first load.
        if (!controller.signal.aborted && !firstRun) {
          window.location.href = url; // always use the updated URL
          throw err;
        }
        console.warn('err loading', url, err);
        return true;
      });
  };

  window.addEventListener('replacestate', onReplaceState);
  window.addEventListener('popstate', onPopState);
  window.addEventListener('click', onClick);

  globalHandler();
}

/**
 * Optionally kicks off routing to the target URL, as if a link were clicked or navigation
 * triggered. This will not change the URL until the underlying handler completes.
 *
 * This return false if the request was pre-empted (or was a hash change).
 *
 * @param {string} url to load, including hash
 * @return {boolean} whether a route happened and to prevent default behavior
 */
export function route(url) {
  if (!globalHandler) {
    throw new Error('listen() not called');
  }
  const u = new URL(url, window.location.toString());

  // Check if this is the same URL, but has a hash. If so, allow the *browser*
  // to move to the correct target on the page.
  const candidateUrl = u.pathname + u.search;
  if (candidateUrl === getUrl() && u.hash) {
    return false;
  }

  globalHandler(candidateUrl, u.hash).then((aborted) => {
    if (!aborted) {
      scrollToHashOrTop(u.hash);
      addPageToContentIndex(u.href).catch((error) => {
        console.warn('could not index page', u.href, error);
        trackError(error, 'Content Indexing error');
      });
    }
  });
  return true;
}

/**
 * Requests a reload of the current page using the registered handler.
 */
export function reload() {
  globalHandler();
}
