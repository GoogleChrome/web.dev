/**
 * @fileoverview Tools for language selection and validation.
 * TODO(devnook): Extract isSupportedLocale to a common format.
 * @see https://github.com/GoogleChrome/web.dev/issues/3131
 */

/**
 * A map of supported language codes to their full names.
 * @const
 */
const languageNames = {
  en: 'English',
  pl: 'Polski',
  es: 'Español',
  ko: '한국어',
  zh: '中文',
  ru: 'Русский',
  pt: 'Português',
  ja: '日本語',
  de: 'Deutsch',
  fr: 'Français',
};

/**
 * When we display a list of translations available for a given page,
 * use this ordering for the names of the languages.
 * See https://github.com/GoogleChrome/web.dev/issues/7430
 * @const
 */
const languageOrdering = [
  'de',
  'en',
  'es',
  'fr',
  'pl',
  'pt',
  'ru',
  'zh',
  'ja',
  'ko',
];

/**
 * A default language for the site.
 * @const
 */
const defaultLanguage = 'en';

/**
 * A list of supported languages.
 * @const
 */
const supportedLanguages = Object.keys(languageNames);

/**
 * Temporary validation function (see TODO).
 * @param {string} lang Language code.
 * @return {Boolean} Whether the language code is supported.
 */
function isValidLanguage(lang) {
  return supportedLanguages.indexOf(lang) > -1;
}

module.exports = {
  defaultLanguage,
  isValidLanguage,
  languageNames,
  languageOrdering,
  supportedLanguages,
};
