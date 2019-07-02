import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import htmlEntryPlugin from './lib/html-entry-plugin.mjs';
import copyFilesBuild from './lib/copy-files-build.mjs';
import eleventyBuild from './lib/11ty-build.mjs';

/* eslint-disable require-jsdoc */

export default async function({watch}) {
  await Promise.all([
    copyFilesBuild('src/**/*.mjs', '.build-tmp', {watch}),
  ]);
  await eleventyBuild({watch});

  return {
    output: {
      dir: 'dist',
      format: 'esm',
      assetFileNames: '[name]-[hash][extname]',
    },
    plugins: [
      htmlEntryPlugin(),
      resolve(),
      commonjs({
        include: 'node_modules/**',
      }),
    ],
  };
}
