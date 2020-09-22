/**
 * Generates a random string that can be used to ensure uniqueness of
 * the elements id on a page.
 * @param {string} [idPrefix] An id prefix to be followed by the generated salt.
 *     Used to check the uniqueness of the outcome id (prefix + salt).
 * @return {string} Id salt.
 */
export const generateIdSalt = (idPrefix) => {
  const salt = Math.random().toString(36).substr(2, 9);
  return document.getElementById(idPrefix + salt)
    ? generateIdSalt(idPrefix)
    : salt;
};
