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
 * @param {function(string, boolean=): void} handler
 */
export function listen(handler) {
  if (!handler) {
    throw new Error("need handler");
  }
  listen = () => {
    throw new Error("listen can only be called once");
  };

  let requestCount = 0;

  // globalHandler is called for the current page URL (i.e., it reads
  // window.location rather than accepting an argument) to trigger a load via
  // the passed handler.
  globalHandler = () => {
    const localRequest = ++requestCount; // initial load will be 1
    const isAborted = () => localRequest !== requestCount;

    // Trigger the handler immediately, which will abort any previous fetch.
    return Promise.resolve()
      .then(async () => {
        await handler(false, isAborted);
        return isAborted();
      })
      .catch((err) => {
        // Only throw errors if not prseempted and not the first load.
        if (!isAborted() && localRequest !== 1) {
          window.location.href = window.location.href;
          throw err;
        }
      });
  };

  window.addEventListener("replacestate", onReplaceState);
  window.addEventListener("popstate", onPopState);
  window.addEventListener("click", onClick);

  globalHandler();
}

/**
 * Optionally routes to the target URL.
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
  recentActiveUrl = candidateUrl;

  window.history.pushState(null, null, u.toString()); // Edge needs toString
  globalHandler().then((aborted) => {
    if (aborted) {
      return false;
    }

    // Since we're loading this page dynamically, look for the target hash-ed
    // element (if any) and scroll to it.
    const target = document.getElementById(u.hash.substr(1)) || null;
    if (target) {
      // nb. this avoids collision with top menubars etc
      target.scrollIntoView({block: "center"});
    } else {
      document.documentElement.scrollTop = 0;
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
