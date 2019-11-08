import {store} from "./store";
import "./utils/underscore-import-polyfill";
import getMeta from "./utils/meta";

const domparser = new DOMParser();

/**
 * Dynamically loads code required for the passed URL entrypoint.
 *
 * @param {string} url of the page to load modules for.
 * @return {!Promise<?>}
 */
async function loadEntrypoint(url) {
  // Catch "/measure/" but also the trailing-slash-less "/measure" for safety.
  if (url.match(/^\/measure($|\/)/)) {
    return import("./pages/measure.js");
  }
  return import("./pages/default.js");
}

/**
 * Fetch a page as an html string.
 * @param {string} url url of the page to fetch.
 * @return {!HTMLDocument}
 */
async function getPage(url) {
  // Pass a custom header so that the Service Worker knows this request is
  // actually for a document, this is used to reply with an offline page
  const headers = new Headers();
  headers.set("X-Document", "1");

  const res = await fetch(url, {headers});
  if (!res.ok && res.status !== 404) {
    throw res.status;
  }

  const text = await res.text();
  return domparser.parseFromString(text, "text/html");
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
 * @param {boolean} isFirstRun whether this is the first run
 * @return {!Promise<void>}
 */
export async function swapContent(isFirstRun) {
  let url = window.location.pathname + window.location.search;
  const entrypointPromise = loadEntrypoint(url);

  // If we disagree with the URL we're loaded at, then replace it inline
  const normalized = normalizeUrl(url);
  if (normalized) {
    window.history.replaceState(null, null, normalized + window.location.hash);
    url = window.location.pathname + window.location.search;
  }

  // When the router boots it will always try to run a handler for the current
  // route. We don't need this for the HTML of the initial page load so we
  // cancel it, but wait for the page's JS to load.
  if (isFirstRun) {
    await entrypointPromise;
    return;
  }

  store.setState({isPageLoading: true});

  const main = document.querySelector("main");

  // Grab the new page content
  let page;
  let content;
  try {
    page = await getPage(url);
    content = page.querySelector("#content");
    if (content === null) {
      throw new Error(`no #content found: ${url}`);
    }
    await entrypointPromise;
  } finally {
    // We set the currentUrl in global state _after_ the page has loaded. This
    // is different than the History API itself which transitions immediately.
    store.setState({
      isPageLoading: false,
      currentUrl: url,
    });
  }

  ga("set", "page", window.location.pathname);
  ga("send", "pageview");

  // Remove the current #content element
  main.querySelector("#content").remove();
  main.appendChild(page.querySelector("#content"));

  // Update the page title
  document.title = page.title;
  // Update the page description
  const description = page.querySelector("meta[name=description]");
  const updatedContent = description ? description.content : "";
  document.querySelector("meta[name=description]").content = updatedContent;

  // Focus on the first title (or fallback to content itself)
  forceFocus(content.querySelector("h1, h2, h3, h4, h5, h6") || content);

  // Determine if this was the offline page
  const isOffline = Boolean(getMeta("offline", page));

  store.setState({
    isPageLoading: false,
    isOffline,
  });
}
