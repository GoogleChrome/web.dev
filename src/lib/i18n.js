/**
 * Detects if link should navigate to `i18n` path
 * and then navigates there.
 *
 * @param {MouseEvent} e
 */
function i18nClickEvent(e) {
  let target = /** @type {HTMLElement} */ (e.target);

  if (target && target.tagName !== 'A') {
    target = /** @type {HTMLElement} */ (target?.parentNode);
  }

  const href = target.getAttribute('href');

  if (
    window.location.pathname.startsWith('/i18n') &&
    target.tagName === 'A' &&
    !href.startsWith('#')
  ) {
    const urlRegex = window.location.pathname.match(/\/i18n\/([a-z]{2})\/*/);
    target.setAttribute('href', `/i18n/${urlRegex[1]}${href}`);
  }
}

document.addEventListener('click', i18nClickEvent);
