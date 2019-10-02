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

const express = require('express');
const app = express();

// Match e.g., "/hello", "/hello/foo", but not "/blah/foo.svg". Does not match "/": this is checked
// in the conditional below on its own.
const contentPageMatch = /^(\/\w+)+$/;

// Disallow requests to "index.html" in any subdirectory (send a 302) along with
// requests to a subdirectory that end with "/". This means that e.g., the
// measure page, technically at "https://web.dev/measure/index.html", will
// only be served under "https://web.dev/measure".
// This resolves ambiguity for Service Workers and the Navaid router (which
// internally trims trailing slashes for JS-based routing).
const contentHandler = (req, res, next) => {
  if (req.url === '/') {
    req.url = '/index.html';
  } else if (req.url.endsWith('/index.html') || req.url.endsWith('/')) {
    const index = req.url.lastIndexOf('/');
    const redir = req.url.substr(0, index);

    // 301 means that Chrome and friends don't put the incorrect URL in the browser's history.
    res.writeHead(301, {Location: redir});
    return res.end();
  } else if (contentPageMatch.exec(req.url)) {
    req.url += '/index.html';
  }

  return next();
};

app.use(
  express.static('dist', {index: false}),
  contentHandler,
  express.static('dist/en', {index: false, redirect: false}),
);

const listener = app.listen(process.env.PORT || 8080, () => {
  // eslint-disable-next-line
  console.log('The server is listening on port ' + listener.address().port);
});
