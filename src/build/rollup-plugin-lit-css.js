/**
 * @fileoverview Builds a Rollup plugin which compiles '.scss.js' files into
 * a CSS tag used by lit-element.
 *
 * This is custom-built as we need a plugin that doesn't collide with directly
 * importing '.scss' files on their own during migration.
 */

const path = require('path');
const compileCSS = require('./compile-css.js');

module.exports = (isProd) => {
  return {
    name: 'lit-css',

    resolveId(id, importer) {
      if (id.endsWith('.scss.js') && !path.isAbsolute(id)) {
        return {
          id: path.join(path.dirname(importer), id),
          external: false,
        };
      }
    },

    async load(id) {
      if (!id.endsWith('.scss.js')) {
        return;
      }

      // Strip the '.js' and then compile with our regular path.
      const stylesPath = id.substr(0, id.length - '.js'.length);
      const result = compileCSS({
        input: stylesPath,
        compress: isProd,
        autoprefixer: isProd,
      });
      // TODO: not logging/throwing errors
      const s = result.css.toString('utf-8');
      // TODO: probably a nicer way to ensure escaping
      return `
import {css} from 'lit-element';
export default css\`${s.replace('`', '\\`')}\`;
      `;
    },
  };
};
