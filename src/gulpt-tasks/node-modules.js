const {src, dest} = require('gulp');

const nodeModules = () => {
  return src([
    './node_modules/@webcomponents/webcomponentsjs/bundles/*.js',
  ]).pipe(dest('./dist/lib/webcomponents/bundles/'));
};

module.exports = nodeModules;
