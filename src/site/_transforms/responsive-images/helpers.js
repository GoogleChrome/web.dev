const site = require("../../_data/site");
const path = require("path");

/**
 *
 * @param {string} src src attribute for image
 * @param {string} outputPath Output path for HTML file
 *
 * @return {{src: string, isLocal: boolean}}
 */
function determineImagePath(src, outputPath) {
  const isLocal = !RegExp("^https?://").test(src);

  if (!isLocal) {
    return {
      src,
      isLocal,
    };
  }

  if (path.isAbsolute(src)) {
    return {src: new URL(src, site.imageCdn), isLocal};
  }

  // At this point we've determined that the image has a relative path.
  let base = path
    .dirname(outputPath)
    .split(path.sep)
    .pop();

  // The handbook is the only place on the site where we nest paths.
  if (outputPath.includes("handbook")) {
    base = path.join("handbook", base);
  }

  return {src: new URL(path.join(base, src), site.imageCdn), isLocal};
}

module.exports = {determineImagePath};
