const fs = require('fs');
const path = require('path');
const runEleventy = require('./runEleventy');

describe.only('_collections', function() {
  describe('in DEV env', function() {
    before(async function() {
      await runEleventy('dev');
      console.log('Eleventy build finished. Starting tests...');
    });

    after(function() {
      fs.rmdirSync(path.join('.', '.tmp'), {recursive: true});
    });

    require('./posts-with-lighthouse/dev.spec');
  });
});
