const outputPermalink = require('../../build/output-permalink');
const languageList = require('../_includes/components/LanguageList');

module.exports = {
  eleventyComputed: {
    tags: (data) => {
      // Add the following tags if necessary
      const originTrials = 'origin-trials';

      if (typeof data.tags === 'string') {
        data.tags = [data.tags];
      } else if (!Array.isArray(data.tags)) {
        data.tags = [];
      }

      if (data.origin_trial && !data.tags.includes(originTrials)) {
        data.tags.push(originTrials);
      }

      return data.tags;
    },
    permalink: (data) => outputPermalink(data),
  },
  languaugeSupport: (data) => languageList(data),
};
