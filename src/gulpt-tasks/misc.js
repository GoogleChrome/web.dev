const {dest, src} = require('gulp');

// These are misc top-level assets.
const misc = () => {
  return src(['./src/misc/**/*']).pipe(dest('./dist'));
};

module.exports = misc;
