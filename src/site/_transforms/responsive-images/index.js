const cheerio = require("cheerio");
const {determineImagePath} = require("./helpers");

module.exports = (content, outputPath) => {
  const $ = cheerio.load(content);
  const $img = $("img");
  $img.each((i, elem) => {
    const $elem = $(elem);
    $elem.attr("src", determineImagePath($elem.attr("src"), outputPath).src);
  });
  return $.html();
};
