const {sha256base64} = require('../_data/lib/hash');
const hashList = new Set();

function cspHash(raw) {
  if (process.env.ELEVENTY_ENV === 'prod') {
    const hash = `'sha256-${sha256base64(raw)}'`;
    hashList.add(hash);
  }
  return raw;
}

function getHashList() {
  return [...hashList];
}

module.exports = {cspHash, getHashList};
