import "./abort-controller-polyfill";

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
 *
 * @param {!Event} e
 */
function onReplaceState(e) {
  recentActiveUrl = getUrl();
}

/**
 * The user has gone forward or back in the stack. Reload new content, or do
 * nothing if it was just a hash change.
 *
 * @param {!Event} e
 */
function onPopState(e) {
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

  // nb. If this ever supports Shadow DOM, we can use .composedPath to find
  // the nearest link inside an open Shadow Root.
  const link = e.target.closest("a[href]");
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
 * Adds global page listeners for SPA routing.
 *
 * @param {function(!Object): ?} handler which returns an optional Promise
 */
export function listen(handler) {
  if (!handler) {
    throw new Error("need handler");
  }
  listen = () => {
    throw new Error("listen can only be called once");
  };

  let previousController = null;

  globalHandler = (url) => {
    const isNavigation = Boolean(url);
    if (!isNavigation) {
      url = getUrl();
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

      const update = url + window.location.hash;
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
        console.warn("err loading", url, err);
        return true;
      });
  };

  window.addEventListener("replacestate", onReplaceState);
  window.addEventListener("popstate", onPopState);
  window.addEventListener("click", onClick);

  globalHandler();
}

/**
 * Optionally kicks off routing to the target URL, as if a link were clicked or navigation
 * triggered. This will not change the URL until the underlying handler completes.
 *
 * This return false if the request was pre-empted (or was a hash change).
 *
 * @param {string} url to load
 * @return {boolean} whether a route happened and to prevent default behavior
 */
export function route(url) {
  if (!globalHandler) {
    throw new Error("listen() not called");
  }
  const u = new URL(url, window.location);

  // Check if this is the same URL, but has a hash. If so, allow the *browser*
  // to move to the correct target on the page.
  const candidateUrl = u.pathname + u.search;
  if (candidateUrl === getUrl() && u.hash) {
    return false;
  }

  globalHandler(candidateUrl).then((aborted) => {
    if (aborted) {
      return false;
    }

    // Since we're loading this page dynamically, look for the target hash-ed
    // element (if any) and scroll to it.
    const hash = u.hash.substr(1);
    if (hash) {
      const target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    document.documentElement.scrollTop = 0;
  });
  return true;
}

/**
 * Requests a reload of the current page using the registered handler.
 */
export function reload() {
  globalHandler();
}
