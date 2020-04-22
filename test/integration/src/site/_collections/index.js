const fs = require('fs');
const path = require('path');
const runEleventy = require('./runEleventy');

describe('_collections', function() {
  describe('_collections in DEV env', function() {
    before(async function() {
      await runEleventy('dev', '.');
      console.log('Eleventy build finished. Starting tests...');
    });

    after(function() {
      fs.rmdirSync(path.join('.', '.tmp'), {recursive: true});
    });

    require('./posts-with-lighthouse/dev.spec');
    require('./recent-posts/dev.spec');
  });

  describe('_collections in PROD env', function() {
    before(async function() {
      await runEleventy('prod', '.');
      console.log('Eleventy build finished. Starting tests...');
    });

    after(function() {
      fs.rmdirSync(path.join('.', '.tmp'), {recursive: true});
    });

    require('./posts-with-lighthouse/prod.spec');
    require('./recent-posts/prod.spec');
  });
});
