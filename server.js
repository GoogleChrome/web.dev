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
const locale = require('locale');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');

const app = express();

const staticFilesPath = [
  'images', 'test', 'app.css', 'app.js'
];

// Detect all locale directories
const supportedLocales = [];
const dirs = fs.readdirSync(path.join(__dirname, 'dist'));
for (const dir of dirs) {
  if (staticFilesPath.includes(dir)) continue;
  supportedLocales.push(dir);
}
const defaultLocale = 'en';

app.use(locale(supportedLocales, defaultLocale));
app.use(cookieParser());
app.use(express.static('dist'));

app.get("*", function(req, res) {
  const dir = req.path.split(path.sep)[1];
  // Serve static files as is
  if (staticFilesPath.includes(dir)) {
    const filePath = path.join(__dirname, 'dist', req.path);
    res.sendFile(filePath);
    return;
  }

  let lang = req.query.hl;
  if (!lang || !supportedLocales.includes(lang)) {
    // `hl` is NOT specified.
    if (req.cookies.preferred_lang) {
      lang = req.cookies.preferred_lang;
    } else if (req.locale) {
      lang = req.locale;
    } else {
      lang = defaultLocale;
    }
  }
  // Update preferred language (with sanity check)
  if (req.query.preferred_lang !== undefined &&
      supportedLocales.includes(lang)) {
    res.cookie('preferred_lang', lang,
      {maxAge: 10 * 365 * 24 * 60 * 60 * 1000, httpOnly: true});
  }

  // Serve the lang specific file from a localized directory
  const localizedFilePath = path.join(__dirname, 'dist', lang, req.path, 'index.html');
  const fallbackFilePath = path.join(__dirname, 'dist', defaultLocale, req.path, 'index.html');
  // TODO: Add `Content-Language` header
  if (fs.existsSync(localizedFilePath)) {
    res.sendFile(localizedFilePath);
  } else {
    res.sendFile(fallbackFilePath);
  }
});

const listener = app.listen(process.env.PORT || 8080, () => {
  // eslint-disable-next-line
  console.log('The server is listening on port ' + listener.address().port);
});
