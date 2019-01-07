/**
 * Copyright 2018 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import express from 'express';
import {constructPage} from './render.mjs';
import serverHelpers from './helpers.mjs';

const PORT = process.env.PORT || 8080;

const app = express();

app.use(serverHelpers.forceSSL);
app.use(serverHelpers.addRequestHelpers);

const inBlacklistUrls = (path) => ['/_d'].find((p) => path.startsWith(p));

// Handle / dynamically.
app.use('/', async (req, res, next) => {
  const path = req.path;
  if (path && path.split('.').length > 1) {
    return next();
  } else if (path && inBlacklistUrls(path)) {
    return res.status(200).send('Fake response from staging server.');
  }

  const tic = Date.now();
  const html = await constructPage(path);
  const toc = Date.now() - tic;

  // eslint-disable-next-line
  console.info(`Headless rendered ${url} in: ${toc}ms`);

  res.set(
      'Server-Timing',
      `Render;dur=${toc};desc="Headless rendering time (ms)"`,
  );

  res.status(200).send(html);
});

// Try static files if dynamic handler can't find resource.
app.use(express.static('build/en', {extensions: ['html', 'htm']}));

app.use(serverHelpers.errorHandler); // catch all.

app.listen(PORT, async () => {
  console.log(`App listening on port ${PORT}`); /* eslint-disable-line */
  console.log('Press Ctrl+C to quit.'); /* eslint-disable-line */
});
