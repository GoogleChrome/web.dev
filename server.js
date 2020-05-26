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

const compression = require('compression');
const express = require('express');
const cookieParser = require('cookie-parser');
const localeHandler = require('./locale-handler.js');
const buildRedirectHandler = require('./redirect-handler.js');

// If true, we'll aggressively nuke the prod Service Worker. For emergencies.
const serviceWorkerKill = true;

const redirectHandler = (() => {
  // In development, Eleventy isn't guaranteed to have run, so read the actual
  // source file.
  const redirectsPath = isProd
    ? 'dist/_redirects.yaml'
    : 'src/site/content/_redirects.yaml';

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
  res.status(404);

  const extMatch = /(\.[^.]*)$/.exec(req.url);
  if (extMatch && extMatch[1] !== '.html') {
    // If this had an extension and it was not ".html", don't send any bytes.
    // This is just a minor optimization to not waste bytes.
    // Pages without extensions won't match here: e.g., "/foo" will still send HTML.
    return res.end();
  }

  const options = {root: 'dist/en'};
  res.sendFile(`404/index.html`, options, (err) => err && next(err));
};

// Implement safety mechanics.
//   * Disallow invalid hostnames (and remove any lasting Service Workers
//     otherwise users could be stuck forever)
//   * Optionally nuke our production Service Worker in an emergency.
//   * Deny loading us in an iframe.
const invalidHostnames = ['www.web.dev', 'appengine-test.web.dev'];
const safetyHandler = (req, res, next) => {
  const isServiceWorkerRequest = Boolean(req.headers['service-worker']);
  if (invalidHostnames.includes(req.hostname)) {
    if (!isServiceWorkerRequest) {
      return res.redirect(301, 'https://web.dev' + req.url);
    }
    // We always nuke the Service Worker for invalid hostnames.
    req.url = '/nuke-sw.js';
  } else if (serviceWorkerKill && isServiceWorkerRequest) {
    // The kill switch is enabled, nuke the Service Worker.
    req.url = '/nuke-sw.js';
  }

  // TODO: This should also be included in a CSP header like:
  //   "Content-Security-Policy: frame-ancestors 'self'"
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  return next();
};

const handlers = [
  safetyHandler,
  localeHandler,
  express.static('dist'),
  express.static('dist/en'),
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
app.use(cookieParser());
app.use(...handlers);

const listener = app.listen(process.env.PORT || 8080, () => {
  // eslint-disable-next-line
  console.log('The server is listening on port ' + listener.address().port);
});
