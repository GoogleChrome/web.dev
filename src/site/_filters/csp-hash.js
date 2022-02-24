const {sha256base64} = require('../_data/lib/hash');
const hashList = new Set();
const scriptList = new Set();

function cspHash(raw) {
  if (process.env.ELEVENTY_ENV === 'prod') {
    const hash = `'sha256-${sha256base64(raw)}'`;
    hashList.add(hash);
  }
  return raw;
}

function cspScript(url) {
  scriptList.add(`${url}`);
  return url;
}

function getHashList() {
  return [...hashList];
}

function getScriptList() {
  return [...scriptList];
}

module.exports = {cspHash, cspScript, getHashList, getScriptList};
