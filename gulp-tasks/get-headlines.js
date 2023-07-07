const gulp = require('gulp');
const each = require('gulp-each');
const fse = require('fs-extra');

/**
 * Loops over all content files and extracts markdown headings
 * @param {*} cb
 * @returns
 */
const getHeadlines = async (cb) => {
  console.log('Getting headlines')
  const headlines = [];
  await new Promise((resolve, reject) => {
    gulp
      .src('./src/site/content/**/**/*.md')
      .pipe(
        each((content, file, callback) => {
          console.log('Getting headlines from', file.path)
          const matches = content.match(/^#{1,6} (.*)$/gm);
          if (matches) {
            headlines.push(...matches);
          }

          callback(null, content);
        }),
      )
      .pipe(gulp.dest('./.tmp/headlines'))
      .on('end', resolve)
      .on('error', reject);
  });

  const uniqueHeadlines = [...new Set(headlines)];
  const document = uniqueHeadlines.join('\n\n');

  await fse.writeFile('./.tmp/headlines.md', document);
  console.log('Done.')
  cb();
};

module.exports = getHeadlines;
