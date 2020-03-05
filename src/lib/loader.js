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
async function getPartial(url) {
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
 * @return {!Promise<void>}
 */
export async function swapContent(isFirstRun) {
  let url = window.location.pathname + window.location.search;

  // If we disagree with the URL we're loaded at, then replace it inline.
  const normalized = normalizeUrl(url);
  if (normalized) {
    window.history.replaceState(null, null, normalized + window.location.hash);
    url = window.location.pathname + window.location.search;
  }

  // Ensure that the correct JS entrypoint is available.
  const entrypointPromise = loadEntrypoint(url);

  // When the router boots it will always try to run a handler for the current route. We don't need
  // this for the HTML of the initial page load so we return early, but always wait for the page's
  // JS to load.
  if (isFirstRun) {
    await entrypointPromise;
    return;
  }

  store.setState({isPageLoading: true});

  const main = document.querySelector("main");

  // Grab the new page content and wait for the JS entrypoint.
  const partial = await getPartial(url);
  await entrypointPromise;

  // Throwing here will cause the router to just do a real page load.
  if (typeof partial !== "object") {
    // This will occur in the Netlify staging environment as we don't serve the 404 JSON.
    throw new Error(`invalid partial for: ${url}`);
  }

  // We set the currentUrl in global state _after_ the page has loaded. This is different than
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
}
