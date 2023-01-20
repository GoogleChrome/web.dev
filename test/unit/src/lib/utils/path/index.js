const {expect} = require('chai');
const {forceForwardSlash} = require('../../../../../../src/lib/utils/path');

describe('Path unit tests', function () {
  it('does not change strings without backslashes`', function () {
    expect(forceForwardSlash('Abc 123!')).to.eql('Abc 123!');
  });

  it('does not change empty strings`', function () {
    expect(forceForwardSlash(' ')).to.eql(' ');
  });

  it('replaces backslashes`', function () {
    expect(forceForwardSlash('\\')).to.eql('/');
  });

  it('replaces all instances`', function () {
    expect(forceForwardSlash('\\a\\b\\c\\d\\e\\')).to.eql('/a/b/c/d/e/');
  });
});
