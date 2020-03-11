/**
 * @fileoverview Handles SPA loading and importing JS entrypoint for web.dev.
 *
 * Exports a single function, swapContent, which ensures that the inner contents of the web.dev
 * template is correct, and that the correct JS entrypoint is ready.
 */

import {store} from "./store";
import "./utils/underscore-import-polyfill";

/**
 * Dynamically loads code required for the passed URL entrypoint.
 *
 * @param {string} url normalize pathname of the page to load modules for.
 * @return {!Promise<?>}
 */
async function loadEntrypoint(url) {
  if (url.startsWith("/measure/")) {
    return import("./pages/measure.js");
  }
  return import("./pages/default.js");
}

/**
 * Gets the partial content of the target normalized URL.
 *
 * @param {string} url of the page to fetch.
 * @return {{raw: string, title: string, offline: (boolean|undefined)}}
 */
export async function getPartial(url) {
  if (!url.endsWith("/")) {
    throw new Error(`partial unsupported for non-folder: ${url}`);
  }

  const res = await fetch(url + "index.json");
  if (!res.ok && res.status !== 404) {
    throw res.status;
  }
  return await res.json();
}

function normalizeUrl(url) {
  const u = new URL(url, window.location);
  let pathname = u.pathname;

  if (pathname.endsWith("/index.html")) {
    // If an internal link refers to "/foo/index.html", strip "index.html" and load.
    pathname = pathname.slice(0, -"index.html".length);
  } else if (!pathname.endsWith("/")) {
    // All web.dev pages end with "/".
    pathname = `${url}/`;
  }

  return pathname + u.search;
}

/**
 * Force the user's cursor to the target element, making it focusable if needed.
 * After the user blurs from the target, it will restore to its initial state.
 *
 * @param {?Element} el
 */
function forceFocus(el) {
  if (!el) {
    // do nothing
  } else if (el.hasAttribute("tabindex")) {
    el.focus();
  } else {
    // nb. This will also operate on elements that implicitly allow focus, but
    // it should be harmless there (aside hiding the focus ring with
    // w-force-focus).
    el.tabIndex = -1;
    el.focus();
    el.classList.add("w-force-focus");

    el.addEventListener(
      "blur",
      (e) => {
        el.removeAttribute("tabindex");
        el.classList.remove("w-force-focus");
      },
      {once: true},
    );
  }
}

/**
 * Swap the current page for a new one. Assumes the current URL is the target.
 *
 * If this is the first run, then the correct HTML will already be in place (from server or Service
 * Worker). Otherwise, async load the partial and replace previous content.
 *
 * Either way, ensure that the correct JS entrypoint is available.
 *
 * @param {boolean} isFirstRun whether this is the first run
 * @param {function(): boolean} isAborted call to determine if load is aborted
 * @return {!Promise<void>}
 */
export async function swapContent(isFirstRun, isAborted) {
  let url = window.location.pathname + window.location.search;

  // If we disagree with the URL we're loaded at, then replace it inline.
  const normalized = normalizeUrl(url);
  if (normalized) {
    const update = normalized + window.location.hash;
    window.history.replaceState(window.history.state, null, update);
    url = window.location.pathname + window.location.search;
  }

  // Ensure that the correct JS entrypoint is available.
  const entrypointPromise = loadEntrypoint(url);

  // When the router boots it will always try to run a handler for the current route. We don't need
  // this for the HTML of the initial page load so we return early, but always wait for the page's
  // JS to load.
  if (isFirstRun) {
    return entrypointPromise;
  }

  store.setState({isPageLoading: true});

  const main = document.querySelector("main");

  // If the partial is found in the current state, this means that this was a back/forward browser
  // nav: just use it as a cache (which is basically how real pages operate). By doing this before
  // any frames occur, the scroll position doesn't "jump" around unexpectedly.
  // It's still possible to see invalid scroll positions, as the router won't preempt currently
  // active page loads (e.g., I load a new page on a very bad network connection and then go back
  // and forward a bunch).
  const {state} = window.history;
  const partialFromHistory = (state && state.partial) || null;

  // Use the network if we don't have the partial (because this is a new navigation or it failed
  // previously).
  const partial = partialFromHistory || (await getPartial(url));
  if (isAborted()) {
    return null; // a further navigation prevented partial from loading
  }
  if (!partialFromHistory) {
    window.history.replaceState({partial}, null, null);
  }

  // Throwing here will cause the router to just do a real page load.
  if (typeof partial !== "object") {
    // This will occur in the Netlify staging environment as we don't serve the 404 JSON.
    throw new Error(`invalid partial for: ${url}`);
  }

  // We set the currentUrl in global state _after_ the partial has loaded. This is different than
  // the History API itself which transitions immediately (like a real web browser).
  store.setState({
    isPageLoading: false,
    currentUrl: url,

    // bootstrap.js uses this to trigger a reload if we see an "online" event. Only returned via
    // the Service Worker if we failed to fetch a 'real' page.
    isOffline: Boolean(partial.offline),
  });

  ga("set", "page", window.location.pathname);
  ga("send", "pageview");

  // Replace the current #content element with the new partial content.
  main.querySelector("#content").innerHTML = partial.raw;

  // Update the page title.
  document.title = partial.title || "";

  // Focus on the first title (or fallback to content itself).
  forceFocus(content.querySelector("h1, h2, h3, h4, h5, h6") || content);

  // Finally, just await for the entrypoint JS. It this fails we'll throw an exception and force a
  // complete reload.
  return entrypointPromise;
}
