const fs = require("fs");
const yamlFont = require("yaml-front-matter");

module.exports = {

  getTitleBySlug: function(filePath, slug) {
    // TODO(robdodson): This may be expensive and slow. See if there's a way
    // to do this without hitting the disk, or at least do it async.
    // Maybe this should be a macro
    const file = fs.readFileSync(
      filePath,
      "utf8"
    );
    return yamlFont.loadFront(file).title;
  },

  getCollectionName: function (page) {
    const urlParts = page.url.split('/');
    if (urlParts.length > 5 && urlParts[3] !== page.fileSlug) {
      return urlParts[3];
    }
    return '';
  },

  getGuidesFromTopics: topics => topics.reduce(
    (guides, topic) => guides.concat(topic.guides), [])
};