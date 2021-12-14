const percySnapshot = require('@percy/puppeteer');
const puppeteer = require('puppeteer');
const scrollToBottom = require('scroll-to-bottomjs');

const pagesToTest = [
  {
    url: '/',
    name: 'Home page',
  },
  {
    url: '/learn/',
    name: 'Learn page',
    navPage: true,
  },
  {
    url: '/accessible/',
    name: 'Collection page',
  },
  {
    url: '/measure/',
    name: 'Measure page',
    navPage: true,
  },
  {
    url: '/blog/',
    name: 'Blog page',
    navPage: true,
  },
  {
    url: '/test-post/',
    name: 'Post page',
  },
  {
    url: '/about/',
    name: 'About page',
    navPage: true,
  },
  {
    url: '/codelab-avoid-invisible-text/',
    name: 'Codelab page',
  },
  {
    url: '/handbook/web-dev-components/',
    name: 'Components page',
  },
  {
    url: '/authors/',
    name: 'Authors page',
  },
  {
    url: '/authors/mgechev/',
    name: 'Author page',
  },
  {
    url: '/tags/',
    name: 'Tags page',
  },
  {
    url: '/shows/',
    name: 'Shows page',
  },
  {
    url: '/podcasts/',
    name: 'Podcasts page',
  },
  {
    url: '/newsletter/',
    name: 'Newsletter page',
  },
  {
    url: '/live/',
    name: 'Live page',
    navPage: true,
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
