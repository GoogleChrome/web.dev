const PercyScript = require("@percy/script");
const scrollToBottom = require("scroll-to-bottomjs");
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
  async (browser, percySnapshot) => {
    for (page of pagesToTest) {
      await browser.goto(`http://localhost:8080/${page.url}`);
      await browser.evaluate(scrollToBottom);
      await browser.waitFor(2000);
      await percySnapshot(`${page.title}`);
    }
  },
  // These flags remove Percy's single-process flag. Without these, any page
  // with an iframe will crash puppeteer (and percy).
  {args: ["--no-sandbox", "--disable-setuid-sandbox"]},
);
