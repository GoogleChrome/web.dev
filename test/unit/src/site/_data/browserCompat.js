const assert = require('assert');
const browserCompat = require('../../../../../src/site/_data/browserCompat');

describe('browserCompat', function () {
  let data;

  before(async function() {
    data = await browserCompat();
  });

  it('every entry has a support value', function () {
    for (const [key, value] of Object.entries(data)) {
      assert.ok(value.support);
    }
  });

  it('includes a nested entry', function () {
    assert.ok(data['api.EventTarget.EventTarget']);
  });

  it('includes an entry with dashes', function () {
    assert.ok(data['css.properties.-moz-context-properties']);
  });

});
