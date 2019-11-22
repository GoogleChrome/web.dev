/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const isProd = Boolean(process.env.GAE_APPLICATION);

const compression = require("compression");
const express = require("express");
const buildRedirectHandler = require("./redirect-handler.js");

const redirectHandler = (() => {
  // In development, Eleventy isn't guaranteed to have run, so read the actual
  // source file.
  const redirectsPath = isProd
    ? "dist/en/_redirects.yaml"
    : "src/site/content/en/_redirects.yaml";

  // Don't block loading the server if the redirect handler couldn't build.
  try {
    return buildRedirectHandler(redirectsPath);
  } catch (e) {
    console.warn(e);
    return (req, res, next) => next();
  }
})();

// 404 handlers aren't special, they just run last.
const notFoundHandler = (req, res, next) => {
  const options = {root: "dist/en"};
  res
    .status(404)
    .sendFile("404/index.html", options, (err) => err && next(err));
};

// Disallow www.web.dev, and remove any active Service Worker too.
const noWwwHandler = (req, res, next) => {
  if (req.hostname === "www.web.dev") {
    if (!req.url.endsWith(".js")) {
      return res.redirect(301, "https://web.dev" + req.url);
    }
    req.url = "/nuke-sw.js";
  }
  return next();
};

const handlers = [
  noWwwHandler,
  express.static("dist"),
  express.static("dist/en"),
  redirectHandler,
  notFoundHandler,
];

// For dev we'll do our own compression. This ensures things like Lighthouse CI
// get a fairly accurate picture of our site.
// For prod we'll rely on App Engine to compress for us.
if (!isProd) {
  handlers.unshift(compression());
}

const app = express();
app.use(...handlers);

const listener = app.listen(process.env.PORT || 8080, () => {
  // eslint-disable-next-line
  console.log('The server is listening on port ' + listener.address().port);
});
