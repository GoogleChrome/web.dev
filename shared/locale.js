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
const fs = require('fs');
const localeCode = require('iso-639-1');
const path = require('path');

const defaultLocale = 'en';
const isProd = Boolean(process.env.GAE_APPLICATION);
const contentDir = isProd ? '../dist' : '../src/site/content';
const dirs = fs.readdirSync(path.join(__dirname, contentDir));
// @ts-ignore
const supportedLocales = dirs.filter((dir) => localeCode.validate(dir));

const isSupportedLocale = (locale) => supportedLocales.indexOf(locale) > -1;

module.exports = {
  defaultLocale,
  supportedLocales,
  isSupportedLocale,
};
