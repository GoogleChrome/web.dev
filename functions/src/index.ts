/*
 * Copyright 2020 Google LLC
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

const isFirebaseProd = !Boolean(process.env.FUNCTIONS_EMULATOR);

import * as functions from 'firebase-functions';
import compression from 'compression';
import express from 'express';
import cookieParser from 'cookie-parser';
import localeHandler from './locale-handler';
import {join} from 'path';

// If true, we'll aggressively nuke the prod Service Worker. For emergencies.
const serviceWorkerKill = false;
const directory = (path: string) => join(__dirname, '../../', path);

// Builds a safety asset handler which matches all requests to e.g. "app-...css", and instead
// returns the current live asset. This applies to both "app.css" and "bootstrap.js".
function buildSafetyAssetHandler() {
  const hashedAssetMatch = /^(\w+)(?:|-\w+)\.(\w+)(?:\?.*|)$/;

  // Matches URLs like "/foo-hash.css" or "/blah.suffix", including an optional query param suffix.
  // Just returns two groups: "foo" and "suffix".
  const runHashedAssetMatch = (cand) => {
    if (cand.startsWith('/')) {
      cand = cand.substr(1);
    }
    const m = hashedAssetMatch.exec(cand);
    if (!m) {
      return {base: null, ext: null};
    }
    const [base, ext] = m.slice(1, 3);
    return {base, ext};
  };

  return (req, _, next) => {
    const {base, ext} = runHashedAssetMatch(req.url);
    if (!base) {
      return next();
    }

    // We don't hash these assets in the upload, so just use them directly.
    if (base === 'bootstrap' && ext === 'js') {
      req.url = '/bootstrap.js';
    } else if (base === 'app' && ext === 'css') {
      req.url = '/app.css';
    }

    return next();
  };
}

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
  buildSafetyAssetHandler(),
  localeHandler,
  express.static(directory('/dist')),
  express.static(directory('/dist/en')),
];

const app = express();

if (!isFirebaseProd) {
  // For dev we'll do our own compression. This ensures things like Lighthouse CI
  // get a fairly accurate picture of our site.
  // For prod we'll rely on App Engine to compress for us.
  handlers.unshift(compression());

  // In dev, serve our source files so that Source Maps can correctly load their
  // original files.
  app.use('/src', express.static(directory('/src')));
}

app.use(cookieParser());
app.use(...handlers);

export const server = functions.https.onRequest((req, res) => app(req, res));
