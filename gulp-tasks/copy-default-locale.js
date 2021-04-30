const gulp = require('gulp');
const {defaultLocale} = require('../src/site/_data/site');

const isProd = process.env.ELEVENTY_ENV === 'prod';
const isStaging = process.env.ELEVENTY_ENV === 'staging';

/**
 * Copies content of the default locale (en) into its own folder
 * on prod builds.
 *
 * This is done for when we deploy to Firebase we need an `i18n/en`
 * folder for users who have English as their primary language,
 * and a second language that is supported by us. Firebase hosting
 * will serve the secondary language as it tries to host i81n content first.
 *
 * @returns {Promise<NodeJS.ReadWriteStream|null>}
 */
const copyDefaultLocale = async () => {
  if (isProd || isStaging) {
    return gulp
      .src(['./dist/**/*.html', '!./dist/i18n/**/*.html'])
      .pipe(gulp.dest(`./dist/i18n/${defaultLocale}`));
  }
};

module.exports = copyDefaultLocale;
