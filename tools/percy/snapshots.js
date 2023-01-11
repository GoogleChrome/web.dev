const percySnapshot = require('@percy/puppeteer');
const puppeteer = require('puppeteer');
const scrollToBottom = require('scroll-to-bottomjs');

const pagesToTest = [
  {
    url: '/',
    name: 'Home page',
  },
  {
    url: '/handbook/content-types/example-landing-page/',
    name: 'Landing page example',
  },
  {
    url: '/handbook/content-types/example-collection/',
    name: 'Collection page example',
  },
  {
    url: '/handbook/content-types/example-post/',
    name: 'Post example',
  },
  {
    url: '/handbook/content-types/example-collection/',
    name: 'Collection page example',
  },
  {
    url: '/handbook/content-types/example-post/',
    name: 'Post example',
  },
];

// A script to navigate our app and take snapshots with Percy.
(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const pageToTest of pagesToTest) {
    const page = await browser.newPage();
    await page.setViewport({height: 1024, width: 1280});

    const url = new URL(pageToTest.url, 'http://localhost:8080').href;
    await page.goto(url, {waitUntil: 'networkidle0'});
    await page.evaluate(scrollToBottom);
    await percySnapshot(page, `${pageToTest.name}`);
    await page.close();
  }

  await browser.close();
})();
