const fs = require('fs');
const path = require('path');
const runEleventy = require('./runEleventy');

describe('_collections', function () {
  describe('in DEV env', function () {
    before(async function () {
      await runEleventy(''); // falsey implies 'dev'
      console.log('Eleventy build finished. Starting tests...');
    });

    after(function () {
      fs.rmdirSync(path.join(__dirname, '.tmp'), {recursive: true});
    });

    require('./posts-with-lighthouse/dev');
  });

  describe('in PROD env', function () {
    before(async function () {
      await runEleventy('prod');
      console.log('Eleventy build finished. Starting tests...');
    });

    after(function () {
      fs.rmdirSync(path.join(__dirname, '.tmp'), {recursive: true});
    });

    require('./posts-with-lighthouse/prod');
  });
});
