const PercyScript = require("@percy/script");

// A script to navigate our app and take snapshots with Percy.
PercyScript.run(
  async (page, percySnapshot) => {
    await page.goto("http://localhost:8080");
    await percySnapshot("Home page");

    await page.goto("http://localhost:8080/learn");
    await percySnapshot("Learn page");

    await page.goto("http://localhost:8080/measure");
    await percySnapshot("Measure page");

    await page.goto("http://localhost:8080/blog");
    await percySnapshot("Blog page");

    await page.goto("http://localhost:8080/about");
    await percySnapshot("About page");
  },
  // These flags remove Percy's single-process flag. Without these, any page
  // with an iframe will crash puppeteer (and percy).
  {args: ["--no-sandbox", "--disable-setuid-sandbox"]},
);
