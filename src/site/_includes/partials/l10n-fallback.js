/**
 * @fileoverview Inline script run on every page load before first render.
 */

/**
 * Sets an attribute on the html element if the page is an i18n fallback
 * to a default language.
 * We do it manually to avoid dependencies.
 */

const langCookie = document.cookie
  .split('; ')
  .filter((cookie) => cookie.startsWith(`firebase-language-override=`))[0];
const langCookieValue = langCookie?.split('=')[1];
const userLanguage = langCookieValue || navigator.language.split('-')[0];
const docLanguage = document.documentElement.lang;
const isI18nFallback = docLanguage === 'en' && userLanguage !== docLanguage;
if (isI18nFallback) {
  document.documentElement.setAttribute('i18n-fallback', 'true');
}
