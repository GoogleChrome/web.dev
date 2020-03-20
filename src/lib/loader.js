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
 * Gets the partial content of the target normalized URL. Returns null if aborted.
 *
 * @param {string} url of the page to fetch.
 * @param {!AbortSignal=} signal
 * @return {?{raw: string, title: string, offline: (boolean|undefined)}}
 */
export async function getPartial(url, signal) {
  if (!url.endsWith("/")) {
    throw new Error(`partial unsupported for non-folder: ${url}`);
  }

  try {
    const res = await fetch(url + "index.json", {signal});
    if (!res.ok && res.status !== 404) {
      throw res.status;
    }
    return await res.json();
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      return null;
    }
    throw e;
  }
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
 * Replaces the current #content element with new partial content.
 *
 * @param {!Object} partial
 */
function updateDom(partial) {
  const content = document.querySelector("main #content");
  content.innerHTML = partial.raw;

  // Update the page title.
  document.title = partial.title || "";

  // Focus on the first title (or fallback to content itself).
  forceFocus(content.querySelector("h1, h2, h3, h4, h5, h6") || content);
}

/**
 * Swap the current page for a new one. Accepts an incoming URL.
 *
 * @param {{
 *   firstRun: boolean,
 *   url: string,
 *   signal: !AbortSignal,
 *   ready: function(string, ?Object): void,
 *   state: ?Object,
 * }} object
 */
export async function swapContent({firstRun, url, signal, ready, state}) {
  url = normalizeUrl(url);

  // Kick off loading the correct JS entrypoint.
  const entrypointPromise = loadEntrypoint(url);

  // If this is the first run, bail out early. We generate an inferred partial for back/forward nav,
  // as we only have the initial prerendered HTML.
  if (firstRun) {
    const content = document.querySelector("main #content");
    const inferredPartial = {
      raw: content.innerHTML,
      title: document.title,
    };
    if (store.getState().isOffline) {
      inferredPartial.offline = true;
    }
    ready(url, {partial: inferredPartial});
    return entrypointPromise;
  }

  // Either use a partial from the previous state (user has hit back/forward) if it's not offline,
  // or fetch it anew from the network.
  let partial;
  if (state && state.partial && !state.partial.offline) {
    partial = state.partial;
  } else {
    store.setState({isPageLoading: true});
    partial = await getPartial(url, signal);
    if (signal.aborted) {
      return null;
    }
  }

  // If the partial was bad, force a real page load. This will occur in Netlify or other simple
  // staging environments on 404, where we don't serve real JSON.
  if (!partial || typeof partial !== "object") {
    throw new Error(`invalid partial for: ${url}`);
  }

  // The bootstrap code uses this to trigger a reload if we see an "online" event. Only returned via
  // the Service Worker if we failed to fetch a 'real' page.
  const isOffline = Boolean(partial.offline);
  store.setState({currentUrl: url, isOffline});

  // Inform the router that we're ready early (even though the JS isn't done). This updates the URL,
  // which must happen before DOM changes and ga event.
  ready(url, {partial});

  ga("set", "page", window.location.pathname);
  ga("send", "pageview");
  updateDom(partial);

  // Finally, just await for the entrypoint JS. It this fails we'll throw an exception and force a
  // complete reload.
  await entrypointPromise;

  if (!signal.aborted) {
    store.setState({isPageLoading: false});
  }
}
