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
  res.sendFile("404/index.html", options, (err) => err && next(err));
};

const handlers = [
  express.static("dist"),
  express.static("dist/en"),
  redirectHandler,
  notFoundHandler,
];

const app = express();
app.use(...handlers);

const listener = app.listen(process.env.PORT || 8080, () => {
  // eslint-disable-next-line
  console.log('The server is listening on port ' + listener.address().port);
});
