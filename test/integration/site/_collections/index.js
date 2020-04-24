const fs = require('fs');
const path = require('path');
const runEleventy = require('./runEleventy');

describe.only('_collections', function() {
  describe('in DEV env', function() {
    before(async function() {
      // Disable the timeout as it'll take build a little while to finish.
      // eslint-disable-next-line
      this.timeout(0);

      await runEleventy('dev');
      console.log('Eleventy build finished. Starting tests...');
    });

    after(function() {
      fs.rmdirSync(path.join(__dirname, '.tmp'), {recursive: true});
    });

    require('./posts-with-lighthouse/dev.spec');
  });
});
