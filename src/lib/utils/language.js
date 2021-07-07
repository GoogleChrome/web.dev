/**
 * @fileoverview Tools for language selection and validation.
 * TODO(devnook): Extract isSupportedLocale to a common format.
 * @see https://github.com/GoogleChrome/web.dev/issues/3131
 */
 import cookies from 'js-cookie';

/**
 * A map of supported language codes to their full names.
 * @const
 */
const languageNames = {
  en: 'English',
  pl: 'Polski',
  es: 'Español',
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

/**
 * Returns the language set as preferred by the user.
 * @return {string} Language the user set via a cookie or the browser UI.
 */
function getUserPreferredLanguage() {
  const cookieLang = cookies.get('firebase-language-override');
  if (isValidLanguage(cookieLang)) {
    return cookieLang;
  }
  const browserLang = navigator.language.split('-')[0];
  if (isValidLanguage(browserLang)) {
    return browserLang;
  }
}

/**
 * Checks if the language set by the user via a cookie or the browser UI
 * is the same as the document languauge.
 * @return {Boolean} True if the languages are the same.
 */
function isI18nFallback() {
  const userLanguage = getUserPreferredLanguage();
  const docLanguage = document.documentElement.lang;
  return docLanguage === defaultLanguage && userLanguage !== docLanguage;
}

export default {
  languageNames,
  defaultLanguage,
  isValidLanguage,
  supportedLanguages,
  isI18nFallback,
};
