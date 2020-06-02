/**
 * @fileoverview
 * Utility functions for generating pass/fail/warning statuses for tests.
 */

const okStatus = 'ok';
const failStatus = 'fail';
const warnStatus = 'warn';

/** @typedef {{status: string, message?: string}} Status */

/**
 * @return {Status}
 */
const ok = () => {
  return {status: okStatus};
};

/**
 * @param {string} message
 * @param {Object?} opts
 * @return {Status}
 */
const fail = (message, ...opts) => {
  return Object.assign({status: failStatus, message}, ...opts);
};

/**
 * @param {string} message
 * @param {Object?} opts
 * @return {Status}
 */
const warn = (message, ...opts) => {
  return Object.assign({status: warnStatus, message}, ...opts);
};

module.exports = {ok, fail, warn, okStatus, failStatus, warnStatus};
