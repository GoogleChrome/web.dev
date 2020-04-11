module.exports = (content) => {
  // Lazy loaded images make our screenshot tests flaky.
  // This transform will make all images load synchronously.
  const cheerio = require('cheerio');
  const $ = cheerio.load(content);
  $('[loading="lazy"]').removeAttr('loading');
  return $.html();
};
