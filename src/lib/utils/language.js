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
  pl: 'Polish', // TODO: Uncomment when PL language is prod-ready.
};

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

function getLanguageFromPath(path) {
  const parts = path.split('/');
  return isValidLanguage(parts[1]) && parts[1];
}

export default {
  languageNames,
  defaultLanguage,
  isValidLanguage,
  supportedLanguages,
  getLanguageFromPath,
};
