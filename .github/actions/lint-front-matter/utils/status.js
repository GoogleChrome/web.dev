const okStatus = 'ok';
const failStatus = 'fail';
const warnStatus = 'warn';

const ok = () => {
  return {status: okStatus};
};

const fail = (message, ...opts) => {
  return Object.assign({status: failStatus, message}, ...opts);
};

const warn = (message, ...opts) => {
  return Object.assign({status: warnStatus, message}, ...opts);
};

module.exports = {ok, fail, warn, okStatus, failStatus, warnStatus};
