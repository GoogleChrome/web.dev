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

  // Grab the new page content.
  let page;
  try {
    let offlineResponse = false;
    let response;
    try {
      response = await fetch(url);
      store.setState({isOffline: false});
    } catch (e) {
      // Assume raw fetch exceptions are network failures.
      store.setState({isOffline: true});

      // This should be handled by the Service Worker. If it also fails, the SW
      // isn't installed or isn't working, so cause a real error.
      response = await fetch("/offline/");
      offlineResponse = true;
    }

    if (!response.ok) {
      throw response.status;
    }
    const text = await response.text();
    page = domparser.parseFromString(text, "text/html");

    // If this wasn't the offline page, wait for the entrypoint, which has been
    // happily loading in the background.
    if (!offlineResponse) {
      await entrypointPromise;
    }
  } catch (e) {
    // If something fails, just make a browser URL change.
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
  main.appendChild(page.querySelector("#content"));
  // Update the page title
  document.title = page.title;
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
