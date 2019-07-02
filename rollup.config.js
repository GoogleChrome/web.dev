import resolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import entrypointHashmanifest from 'rollup-plugin-entrypoint-hashmanifest';

module.exports = {
  input: 'src/lib/app.js',
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: '[name].[hash].js',
    chunkFileNames: '[name].[hash].js',
  },
  plugins: [
    resolve(),
    commonJs({
      include: 'node_modules/**',
    }),
    postcss({
      extract: true,
    }),
    entrypointHashmanifest(),
  ],
};
