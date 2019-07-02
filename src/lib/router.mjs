import navaid from 'navaid';

const router = navaid();
let isFirstRun = true;
const domparser = new DOMParser();

router
  .on('/', async () => {
    return swapContent('index.html');
  })
  .on('/*', async (params) => {
    return swapContent(params.wild);
  });

/**
 * Swap the current page for a new one.
 * @param {string} url url of the page to swap.
 * @return {Promise}
 */
async function swapContent(url) {
  if (isFirstRun) {
    /* eslint-disable-next-line */
    console.log('First run, returning.');
    isFirstRun = false;
    return;
  }

  const main = document.querySelector('main');
  // Grab the new page content
  const page = await getPage(url);
  // Remove the current #content element
  main.firstElementChild.remove();
  // Swap in the new #content element
  main.appendChild(page.querySelector('#content'));
}

/**
 * Fetch a page as an html string.
 * @param {string} url url of the page to fetch.
 * @return {Promise<string>}
 */
async function getPage(url) {
  const res = await fetch(`/${url}`);
  const text = await res.text();
  return domparser.parseFromString(text, 'text/html');
}


export {router};
