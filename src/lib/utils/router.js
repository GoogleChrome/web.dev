let globalHandler;
let recentActiveUrl; // current URL not including hash

// Disable automatic scroll restoration. This is helpful as back/forward behavior is technically
// async, and most browsers will move the scroll position automatically for us, even on old content.
// Instead, we call `scrollOnFrame` when the async load helper is done.
window.history.scrollRestoration = "manual";
window.addEventListener("pagehide", (e) => {
  // ... but re-enable when the page is unloaded, which happens if a user refreshes the page using
  // their browser. This prevents this type of reload from jumping back to the top of the viewport.
  window.history.scrollRestoration = "auto";
});

/**
 * @return {string} URL pathname plus optional search part
 */
function getUrl() {
  return window.location.pathname + window.location.search;
}

/**
 * Brings the target element, or top scroll position, into view.
 *
 * @param {!Element|number} target
 */
function scrollOnFrame(target) {
  if (target instanceof Element) {
    // nb. this avoids collision with top menubars etc
    target.scrollIntoView({block: "center"});
  } else {
    document.documentElement.scrollTop = +target || 0;
  }
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
  const state = window.history.state;
  globalHandler().then((success) => {
    if (success) {
      scrollOnFrame(state ? state.scrollTop : 0);
    }
  });
}

/**
 * Retain the current scroll position for forward/back stack changes.
 */
function onDedupScroll() {
  const state = {
    scrollTop: document.documentElement.scrollTop,
  };
  window.history.replaceState(state, null, null);
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

  let pendingHandlerPromise = Promise.resolve();
  let requestCount = 0;

  // globalHandler is called for the current page URL (i.e., it reads
  // window.location rather than accepting an argument) to trigger a load via
  // the passed handler. Only one handler can run at once.
  globalHandler = () => {
    const localRequest = ++requestCount;

    // Delay until any previous load is complete, then run handler for the
    // now-active URL.
    pendingHandlerPromise = pendingHandlerPromise
      .then(async () => {
        if (localRequest !== requestCount) {
          return false;
        }
        await handler();
        return true;
      })
      .catch((err) => {
        window.location.href = window.location.href;
        throw err;
      });
    return pendingHandlerPromise;
  };

  window.addEventListener("replacestate", onReplaceState);
  window.addEventListener("popstate", onPopState);
  window.addEventListener("click", onClick);

  // Write scroll value after settling.
  let scrollTimeout = 0;
  window.addEventListener(
    "scroll",
    () => {
      window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(onDedupScroll, 250);
    },
    {passive: true},
  );

  // And on initial load.
  onDedupScroll();

  // Don't catch errors for the first load.
  recentActiveUrl = getUrl();
  handler(true);
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
  globalHandler().then((success) => {
    if (success) {
      // Since we're loading this page dynamically, look for the target hash-ed
      // element (if any) and scroll to it.
      const target = document.getElementById(u.hash.substr(1)) || 0;
      return scrollOnFrame(target);
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
