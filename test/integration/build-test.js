const assert = require("assert");
const fs = require("fs");
const path = require("path");
const dist = path.resolve(__dirname, "..", "..", "dist");

describe("Build", function() {
  it("generates the expected files", function() {
    [
      path.join("en", "_redirects.yaml"),
      path.join("en", "algolia.json"),
      path.join("en", "feed.xml"),
      path.join("en", "index.html"),
      path.join("en", "index.json"),
      path.join("en", "robots.txt"),
      path.join("images", "favicon.ico"),
      path.join("images", "lockup.svg"),
      "app.css",
      "bootstrap.js",
      "manifest.webmanifest",
      "nuke-sw.js",
      "sitemap.xml",
      "sw-partial-layout.partial",
      "sw.js",
    ].forEach((file) =>
      assert.ok(
        fs.existsSync(path.join(dist, file)),
        `Could not find ${file} in ${dist}`,
      ),
    );
  });
});
