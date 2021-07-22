const path = require('path');
const outputPermalink = require('../../build/output-permalink');

module.exports = {
  permalink: function (data) {
    if (Object.keys(data).length === 0) {
      return;
    }
    const build = outputPermalink(data);
    const serverless = path.join(
      '/serverless',
      build.replace('index.html', ''),
    );

    return {build, serverless};
  },
};
