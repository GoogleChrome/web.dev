/**
 * @fileoverview The world's smallest assertion library.
 * We ONLY use this assert library in our front-end tests because we have to
 * bundle all of our dependencies using rollup.
 * It should not be used to test other things like site because those are Node
 * modules and can be tested using Node's built-in assert module.
 *
 * @param {boolean} condition A condition to test.
 * @param {string} message Text to log if the condition fails.
 */
export function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
