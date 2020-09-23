/**
 * @fileoverview Helper that uses Terser to minify on-disk JS.
 */

const terser = require('terser');
const path = require('path');
const fs = require('fs').promises;

/**
 * Minify the passed on-disk script files. Assumes they have an adjacent ".map" source map.
 *
 * @param {!Array<string>} generated paths to generated script files
 * @return {Promise<number>} ratio of compressed output to original source
 */
async function compressOutput(generated) {
  let inputSize = 0;
  let outputSize = 0;

  for (const fileName of generated) {
    const target = path.join('dist', fileName);

    const raw = await fs.readFile(target, 'utf8');
    inputSize += raw.length;

    const sourceMapContent = JSON.parse(
      await fs.readFile(target + '.map', 'utf8'),
    );

    const result = terser.minify(raw, {
      sourceMap: {
        content: sourceMapContent,
        url: fileName + '.map',
      },
    });

    if (result.error) {
      throw new Error(`could not minify ${fileName}: ${result.error}`);
    }

    outputSize += result.code.length;
    await fs.writeFile(target, result.code, 'utf8');
    await fs.writeFile(target + '.map', result.map, 'utf8');
  }

  const ratio = outputSize / inputSize;
  return ratio;
}

module.exports = compressOutput;
