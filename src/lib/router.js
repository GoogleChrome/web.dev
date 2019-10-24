import navaid from "navaid";
import {store} from "./store";
import "./utils/underscore-import-polyfill";

const router = navaid();
let isFirstRun = true;
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
 * @return {Promise<string>}
 */
async function getPage(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw res.status;
  }
  const text = await res.text();
  return domparser.parseFromString(text, "text/html");
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
 * Swap the current page for a new one.
 * @param {string} url url of the page to swap.
 * @return {Promise}
 */
async function swapContent(url) {
  document.dispatchEvent(new CustomEvent("pageview", {detail: url}));
  const entrypointPromise = loadEntrypoint(url);

  // When the router boots it will always try to run a handler for the current
  // route. We don't need this for the HTML of the initial page load so we
  // cancel it, but wait for the page's JS to load.
  if (isFirstRun) {
    isFirstRun = false;
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
  } catch (e) {
    // If something fails, just make a browser URL change
    window.location.href = window.location.href;
    throw e;
  } finally {
    // We set the currentUrl in global state _after_ the page has loaded. This
    // is different than the History API itself which transitions immediately.
    store.setState({
      isPageLoading: false,
      currentUrl: url,
    });
  }
  // Remove the current #content element
  main.querySelector("#content").remove();
  // Swap in the new #content element
  main.appendChild(content);
  // Update the page title
  document.title = page.title;
  // Focus on the first title (or fallback to content itself)
  forceFocus(content.querySelector("h1, h2, h3, h4, h5, h6") || content);
  // Scroll to top
  document.scrollingElement.scrollTop = 0;
}

router
  .on("/", async () => {
    return swapContent("/");
  })
  .on("/*", async (params) => {
    if (params.wild.endsWith("/index.html")) {
      // If an internal link refers to "/foo/index.html", strip "index.html" and load.
      const stripped = params.wild.slice(0, -"index.html".length);
      return swapContent(`/${stripped}`);
    } else if (window.location.pathname.endsWith("/")) {
      // Navaid strips a trailing "/" on its own, so ensure it is added again before loading.
      return swapContent(`/${params.wild}/`);
    }

    // This triggers Navaid again, so calling swapContent() here would cause a double load.
    window.history.replaceState(null, null, window.location.pathname + "/");
  });

export {router};
