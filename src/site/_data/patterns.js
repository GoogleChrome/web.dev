const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');

module.exports = {
  navItems(collection) {
    return collection.filter((x) => !x.inputPath.includes('variants'));
  },
  getVariants(item, collection) {
    // If the item itself is a variant, return early.
    if (item.filePathStem.includes('variants')) {
      return;
    }

    const basePath = item.filePathStem.split('/').slice(0, 3).join('/');

    return collection.filter(
      (x) =>
        x.filePathStem.indexOf(basePath) === 0 &&
        x.filePathStem.includes('variants'),
    );
  },
  render(item) {
    const markup = fs.readFileSync(
      path.resolve(__basedir, item.inputPath),
      'utf8',
    );

    return nunjucks.renderString(markup, {data: item.data});
  },
  renderSource(item) {
    const markup = fs.readFileSync(
      path.resolve(__basedir, item.inputPath),
      'utf8',
    );

    return markup;
  },
  getDocs(item) {
    const docsPath = path.join(
      __basedir,
      path.dirname(item.inputPath),
      'docs.md',
    );

    if (!fs.existsSync(docsPath)) {
      return null;
    }

    const docsContent = fs.readFileSync(docsPath, 'utf8');

    return docsContent;
  }
};
