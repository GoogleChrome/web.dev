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
import fs from 'fs';
import path from 'path';

/**
 * @TODO Delete below
 */
const localeCode = require('iso-639-1');

const isProd = !Boolean(process.env.FUNCTIONS_EMULATOR);
const contentDir = isProd ? '../../dist' : '../../src/site/content';
const dirs = fs.readdirSync(path.join(__dirname, contentDir));
// @ts-ignore
const supportedLocales = dirs.filter((dir) => localeCode.validate(dir));

const isSupportedLocale = (locale) => supportedLocales.indexOf(locale) > -1;

const indexJsonRegExp = /\/index\.json$/;

const locale = {
  defaultLocale: 'en',
  supportedLocales,
  isSupportedLocale,
};
/**
 * @TODO Delete above
 */

/**
 * A handler that redirects the request based on requested locale,
 * according to priority:
 * 1. Locale directly expressed in the url, e.g. /en/some-post
 * 2. Locale in accept-language HTTP header.
 * 3. Locale in "preferred_locale" cookie.
 * If requested locale's content does not exist, falls back to default.
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 * @param {Function} next Middleware next handler.
 * @return {!Function}
 */
export default (req, res, next) => {
  const isNav = req.url.endsWith('/');
  const isJson = req.url.endsWith('/index.json');
  // Exit early if the url is not navigational.
  if (!isNav && !isJson) {
    return next();
  }

  const fileType = isJson ? 'index.json' : 'index.html';
  const normalizedPath = req.path.replace(indexJsonRegExp, '');
  const pathParts = normalizedPath.split('/');
  const isLangInPath = locale.isSupportedLocale(pathParts[1]);
  let lang;
  let filePath;

  // Check if language is specified in the url.
  if (isLangInPath) {
    lang = pathParts[1];
    pathParts.splice(1, 1);
    pathParts.push(fileType);
    filePath = pathParts.join('/');
  } else {
    const langInCookie = locale.isSupportedLocale(req.cookies.preferred_lang);
    // If language not in url, use accept-language header.
    lang = langInCookie
      ? req.cookies.preferred_lang
      : req.acceptsLanguages(locale.supportedLocales) || locale.defaultLocale;
    filePath = path.join(normalizedPath, fileType);
  }

  if (lang === locale.defaultLocale) {
    // Redirect to a canonical url, if needed.
    const shouldRedirect = isLangInPath && !isJson;
    return shouldRedirect ? res.redirect(path.join('/', filePath)) : next();
  }

  const localizedFilePath = path.join(
    __dirname,
    'dist', // Must serve from dist directory even in dev mode.
    lang,
    filePath,
  );

  if (fs.existsSync(localizedFilePath)) {
    return isLangInPath ? next() : res.redirect(path.join('/', lang, filePath));
  } else {
    return isLangInPath ? res.redirect(path.join('/', filePath)) : next();
  }
};
