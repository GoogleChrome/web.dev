/**
 * The world's smallest assertion library.
 * @param {boolean} condition A condition to test.
 * @param {string} message Text to log if the condition fails.
 */
export function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
