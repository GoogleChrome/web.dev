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
const locales = require("./src/lib/utils/locale");

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
module.exports = (req, res, next) => {
  // Exit early if the url is not navigational.
  if (!req.url.endsWith("/")) {
    return next();
  }

  const pathParts = req.path.split("/");
  // Check if language is specified in the url.
  const isLangInPath = locales.isSupportedLocale(pathParts[1]);
  let lang;
  let filePath;

  if (isLangInPath) {
    lang = pathParts[1];
    pathParts.splice(1, 1);
    filePath = pathParts.join("/");
  } else {
    const langInCookie = locales.isSupportedLocale(req.cookies.preferred_lang);
    // If language not in url, use accept-language header.
    lang =
      langInCookie || req.acceptsLanguages(locales.supportedLocales) || locales.defaultLocale;
    filePath = req.path;
  }

  if (lang === locales.defaultLocale) {
    // If this is alread default language, continue.
    return next();
  }

  const localizedFilePath = path.join(
    __dirname,
    "dist", // Must serve from dist directory even in dev mode.
    lang,
    filePath,
    "index.html",
  );

  if (fs.existsSync(localizedFilePath)) {
    return isLangInPath ? next() : res.redirect(path.join("/", lang, filePath));
  } else {
    return res.redirect(path.join("/", locales.defaultLocale, filePath));
  }
};
