module.exports = {
  getCollectionName: (page) => {
    const urlParts = page.url.split('/');
    if (urlParts.length > 5 && urlParts[3] !== page.fileSlug) {
      return urlParts[3];
    }
    return '';
  },

  getGuidesFromTopics: (topics) => topics.reduce(
    (guides, topic) => guides.concat(topic.guides), []),
};
