const {dest, src} = require('gulp');
const fonts = () => {
  return src('src/fonts/**/*').pipe(dest('dist/fonts/'));
};

module.exports = fonts;
