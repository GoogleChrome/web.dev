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

const express = require('express');
const buildRedirectHandler = require('./redirect-handler.js');

const app = express();

const handlers = [
  express.static('dist'),
  express.static('dist/en'),
];

const redirectsPath = isProd
    ? 'dist/en/_redirects.yaml'
    : 'src/site/content/en/_redirects.yaml';

try {
  const redirectHandler = buildRedirectHandler(redirectsPath);
  handlers.push(redirectHandler);
} catch (e) {
  console.warn(e);
}

app.use(...handlers);

const listener = app.listen(process.env.PORT || 8080, () => {
  // eslint-disable-next-line
  console.log('The server is listening on port ' + listener.address().port);
});
