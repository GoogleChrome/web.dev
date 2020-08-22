const {dest, src} = require('gulp');
const cleanCSS = require('gulp-clean-css');
const sassProcessor = require('gulp-sass');

// TODO: Add autoprefixr
// TODO: Add sourcemaps

// We want to be using canonical Sass, rather than node-sass
sassProcessor.compiler = require('sass');

// Flags whether we compress the output etc
const isProduction = process.env.ELEVENTY_ENV === 'prod';

// An array of outputs that should be sent over to includes
const criticalStyles = ['critical.scss'];

// Takes the arguments passed by `dest` and determines where the output file goes
const calculateOutput = ({history}) => {
  // By default, we want a CSS file in our dist directory, so the
  // HTML can grab it with a <link />
  let response = './dist/css';

  // Get everything after the last slash
  const sourceFileName = /[^/]*$/.exec(history[0])[0];

  // If this is critical CSS though, we want it to go
  // to the _includes directory, so nunjucks can include it
  // directly in a <style>
  if (criticalStyles.includes(sourceFileName)) {
    response = './src/site/_includes/css';
  }

  return response;
};

// The main Sass method grabs all root Sass files,
// processes them, then sends them to the output calculator
const sass = () => {
  return src('./src/styles/**/*.scss')
    .pipe(sassProcessor().on('error', sassProcessor.logError))
    .pipe(cleanCSS(isProduction ? {level: 2} : {}))
    .pipe(dest(calculateOutput, {sourceMaps: !isProduction}));
};

module.exports = sass;
