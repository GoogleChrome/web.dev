const PercyScript = require("@percy/script");

// Puppeteer is only imported so that Code and friends can provide types.
const puppeteer = require("puppeteer"); // eslint-disable-line no-unused-vars

const isDev = Boolean(process.env.WEBDEV_PERCY_DEV); // set by snapshots-dev.js

const pagesToTest = [
  {
    url: "",
    title: "Home page",
  },
  {
    url: "learn",
    title: "Learn page",
  },
  {
    url: "measure",
    title: "Measure page",
  },
  {
    url: "blog",
    title: "Blog page",
  },
  {
    url: "about",
    title: "About page",
  },
];

// A script to navigate our app and take snapshots with Percy.
PercyScript.run(
  async (/** @type {!puppeteer.Page} */ page, percySnapshot) => {
    for (const {url, title} of pagesToTest) {
      await page.goto(`http://localhost:8080/${url}`);
      // Wait for the SPA to update the active link in the top nav.
      await page.waitFor(2000);
      await percySnapshot(title);
    }
    // Navigate back to home page by clicking on a link.
    // This is a canary for problems with the SPA routing code.
    const navigationPromise = page.waitForNavigation();
    await page.click(".web-header__logo-link");
    await navigationPromise;
    await page.waitFor(200);
    await percySnapshot("Home page, navigation");
  },
  // These flags remove Percy's single-process flag. Without these, any page
  // with an iframe will crash puppeteer (and percy).
  {headless: !isDev, args: ["--no-sandbox", "--disable-setuid-sandbox"]},
);
