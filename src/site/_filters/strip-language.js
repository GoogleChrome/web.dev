// Strip the language prefix from urls.
// e.g. /en/foo becomes /foo.
module.exports = (url) => {
  const urlParts = url.split('/');
  urlParts.splice(1, 1);
  return urlParts.join('/');
};
