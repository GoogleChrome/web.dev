const PercyScript = require('@percy/script');
const scrollToBottom = require('scroll-to-bottomjs');
const pagesToTest = [
  {
    url: '/',
    title: 'Home page',
  },
  {
    url: '/learn/',
    title: 'Learn page',
    navPage: true,
  },
  {
    url: '/accessible/',
    title: 'Collection page',
  },
  {
    url: '/measure/',
    title: 'Measure page',
    navPage: true,
  },
  {
    url: '/blog/',
    title: 'Blog page',
    navPage: true,
  },
  {
    url: '/test-post/',
    title: 'Post page',
  },
  {
    url: '/about/',
    title: 'About page',
    navPage: true,
  },
  // Remove this until https://github.com/GoogleChrome/web.dev/issues/4790 is fixed.
  // {
  //   url: '/codelab-avoid-invisible-text/',
  //   title: 'Codelab page',
  // },
  {
    url: '/handbook/web-dev-components/',
    title: 'Components page',
  },
  {
    url: '/authors/',
    title: 'Authors page',
  },
  {
    url: '/authors/mgechev/',
    title: 'Author page',
  },
  {
    url: '/tags/',
    title: 'Tags page',
  },
  {
    url: '/podcasts/',
    title: 'Podcasts page',
  },
  {
    url: '/newsletter/',
    title: 'Newsletter page',
  },
  {
    url: '/live/',
    title: 'Live page',
    navPage: true,
  },
];

async function waitForNavUpdate(page, browser) {
  try {
    page.navPage &&
      (await browser.waitFor(
        (url) => {
          const activeLink = document.querySelector('a[active=""]');

          return activeLink && activeLink.getAttribute('href') === url;
        },
        {polling: 15, timeout: 5000},
        page.url,
      ));
  } catch (err) {
    console.log(`Couldn't find active link for ${page.url}`);
  }
}

// A script to navigate our app and take snapshots with Percy.
PercyScript.run(
  async (browser, percySnapshot) => {
    // set the viewport to a desktop size
    await browser.setViewport({height: 1024, width: 1280});

    for (const page of pagesToTest) {
      const url = new URL(page.url, 'http://localhost:8080').href;
      await browser.goto(url, {waitUntil: 'networkidle0'});
      await browser.evaluate(scrollToBottom);
      // Wait for the SPA to update the active link in the top nav.
      await waitForNavUpdate(page, browser);
      await percySnapshot(`${page.title}`);
    }
  },
  // These flags remove Percy's single-process flag. Without these, any page
  // with an iframe will crash puppeteer (and percy).
  {args: ['--no-sandbox', '--disable-setuid-sandbox']},
);
