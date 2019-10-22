let globalHandler;
let globalCurrentUrl;
let recentActiveUrl; // current URL not including hash

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

function onState(e) {
  const updatedUrl = globalCurrentUrl();
  if (recentActiveUrl === updatedUrl) {
    // This was just a change in hash. Do nothing and let the browser run its
    // own behavior.
    return;
  }
  recentActiveUrl = updatedUrl;
  const state = window.history.state;
  globalHandler().then(() => scrollOnFrame(state ? state.scrollTop : 0));
}

function onScroll() {
  const state = {
    scrollTop: document.documentElement.scrollTop,
  };
  window.history.replaceState(state, null, null);
}

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
  if (!link || link.target || link.host !== location.host) {
    return;
  }

  // Check if this is the same URL, but has a hash. If so, allow the *browser*
  // to move to the correct target on the page.
  const linkUrl = link.pathname + link.search;
  const currentUrl = globalCurrentUrl();
  if (linkUrl === currentUrl && link.hash) {
    return;
  }

  e.preventDefault();
  route(linkUrl, link.hash);
}

export function listen(handler, normalize = () => {}) {
  listen = () => {
    throw new Error("listen can only be called once");
  };
  if (!handler) {
    throw new Error("need handler");
  }

  globalHandler = () => {
    const url = window.location.pathname + window.location.search;
    const p = Promise.resolve(handler(url));
    return p.catch((err) => {
      window.location.href = window.location.href;
      throw err;
    });
  };
  globalCurrentUrl = (use = window.location) => {
    let base = use.pathname + use.search;
    base = normalize(base) || base;
    return base;
  };

  window.addEventListener("popstate", onState);
  window.addEventListener("click", onClick);
  window.addEventListener("scroll", onScroll, {passive: true});

  // Store and normalize current URL.
  recentActiveUrl = globalCurrentUrl();
  window.history.replaceState(
    null,
    null,
    recentActiveUrl + window.location.hash,
  );

  // Don't catch errors for the first load.
  handler(recentActiveUrl, true);
}

/**
 * Routes to the target URL and optional hash. This always loads the new page,
 * even if the URL is the same.
 *
 * @param {string} url in the form "/foo/?bar=123"
 * @param {string=} hash in the form "#foo"
 */
export function route(url, hash = "") {
  //  const u = new URL(url, window.location);
  // TODO: rewrite paths?
  //  url.pathname = rewritePath(url.pathname) || url.pathname;

  const u = new URL(url, window.location);
  recentActiveUrl = globalCurrentUrl(u);

  if (hash && !hash.startsWith("#")) {
    hash = `#${hash}`;
  }
  window.history.pushState(null, null, recentActiveUrl + hash);
  globalHandler().then(() => {
    // Since we're loading this page dynamically, look for the target hash-ed
    // element (if any) and scroll to it.
    const target = document.getElementById(hash.substr(1)) || 0;
    return scrollOnFrame(target);
  });
}
