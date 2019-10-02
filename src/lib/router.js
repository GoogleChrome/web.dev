import navaid from "navaid";
import entrypointForRoute from "./entrypoint-for-route";

const router = navaid();
let isFirstRun = true;
export let entrypointLoaded = false;
const domparser = new DOMParser();

/**
 * Fetch a page as an html string.
 * @param {string} url url of the page to fetch.
 * @return {Promise<string>}
 */
async function getPage(url) {
  const res = await fetch(`/${url}`);
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

  // When the router boots it will always try to run a handler for the current
  // route. But we don't need this for initial page load so we cancel it.
  if (isFirstRun) {
    isFirstRun = false;
    return;
  }

  // Load the entrypoint simultaneously with content.
  const entrypointPromise = entrypointForRoute(url);
  entrypointLoaded = true;

  const main = document.querySelector("main");
  // Grab the new page content
  let page;
  try {
    page = await getPage(url);
  } catch (e) {
    // If something fails, just make a browser URL change
    // TODO(robdodson): In future, failure pages might be HTML themselves
    window.location.href = window.location.href;
    throw e;
  }

  // Wait for code to be ready
  await entrypointPromise;
  // Remove the current #content element
  main.querySelector("#content").remove();
  // Swap in the new #content element
  main.appendChild(page.querySelector("#content"));
}

router
  .on("/", async () => {
    return swapContent("");
  })
  .on("/*", async (params) => {
    return swapContent(params.wild);
  });

export {router};
