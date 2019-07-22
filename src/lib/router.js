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
  const res = await fetch(`/${url}`);
  const text = await res.text();
  return domparser.parseFromString(text, "text/html");
}

/**
 * Swap the current page for a new one.
 * @param {string} url url of the page to swap.
 * @return {Promise}
 */
async function swapContent(url) {
  // When the router boots it will always try to run a handler for the current
  // route. But we don't need this for initial page load so we cancel it.
  if (isFirstRun) {
    isFirstRun = false;
    return;
  }

  const main = document.querySelector("main");
  // Grab the new page content
  const page = await getPage(url);
  // Remove the current #content element
  main.querySelector("#content").remove();
  // Swap in the new #content element
  main.appendChild(page.querySelector("#content"));
}

router
  .on("/", async () => {
    return swapContent("index.html");
  })
  .on("/*", async (params) => {
    return swapContent(params.wild);
  });

export {router};
