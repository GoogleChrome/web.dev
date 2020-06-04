const fs = require('fs');
const path = require('path');
const runEleventy = require('./runEleventy');

describe('_collections', () => {
  describe('in DEV env', () => {
    before(async () => {
      await runEleventy('dev', '.');
      console.log('Eleventy build finished. Starting tests...');
    });

    after(() => {
      fs.rmdirSync(path.join('.', '.tmp'), {recursive: true});
    });

    require('./posts-with-lighthouse/dev');
    require('./recent-blog-posts/dev');
  });

  describe('in PROD env', () => {
    before(async () => {
      await runEleventy('prod', '.');
      console.log('Eleventy build finished. Starting tests...');
    });

    after(() => {
      fs.rmdirSync(path.join('.', '.tmp'), {recursive: true});
    });

    require('./posts-with-lighthouse/prod');
    require('./recent-blog-posts/prod');
  });
});
