import navaid from "navaid";
import {store} from "./store";

const router = navaid();
let isFirstRun = true;
const domparser = new DOMParser();

/**
 * Provides a simple dynamic `import()` polyfill. Does not return the exports
 * from the module: this is not how web.dev uses dynamic import.
 *
 * @param {string} src
 * @return {!Promise<?>}
 */
window._import = (src) => {
  return new Promise((resolve, reject) => {
    const n = Object.assign(document.createElement("script"), {
      src,
      type: "module",
      onload: () => resolve(),
      onerror: reject,
    });
    // nb. This is a noop for modules which are already loaded.
    document.head.append(n);
    n.remove();
  });
};

/**
 * Dynamically loads code required for the passed URL entrypoint.
 *
 * @param {string} url of the page to load modules for.
 * @return {!Promise<?>}
 */
async function loadEntrypoint(url) {
  if (url === "measure") {
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
 * Swap the current page for a new one.
 * @param {string} url url of the page to swap.
 * @return {Promise}
 */
async function swapContent(url) {
  document.dispatchEvent(new CustomEvent("pageview", {detail: url}));
  const entrypointPromise = loadEntrypoint(url);

  // When the router boots it will always try to run a handler for the current
  // route. We don't need this for initial page load so we cancel it, but wait
  // for the page's JS to load.
  if (isFirstRun) {
    isFirstRun = false;
    await entrypointPromise;
    return;
  }

  store.setState({isPageLoading: true});

  const main = document.querySelector("main");

  // Grab the new page content
  let page;
  try {
    page = await getPage(url);
    await entrypointPromise;
  } catch (e) {
    // If something fails, just make a browser URL change
    // TODO(robdodson): In future, failure pages might be HTML themselves
    window.location.href = window.location.href;
    throw e;
  } finally {
    store.setState({isPageLoading: false});
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
