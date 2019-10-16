import navaid from "navaid";

const router = navaid();
let isFirstRun = true;
const domparser = new DOMParser();

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

  // When the router boots it will always try to run a handler for the current
  // route. But we don't need this for initial page load so we cancel it.
  if (isFirstRun) {
    isFirstRun = false;
    return;
  }

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
  // Remove the current #content element
  main.querySelector("#content").remove();
  // Swap in the new #content element
  main.appendChild(page.querySelector("#content"));
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

    // Otherwise, this is a request for e.g. "/measure". By calling history.replaceState() to
    // re-add the trailing slash, Navaid will re-run this code and trigger the latter conditional
    // above. (If we also call swapContent(), two requests will fire.)
    // This doesn't modify the back stack, so further navigation works fine.
    window.history.replaceState(null, null, window.location.pathname + "/");
  });

export {router};
