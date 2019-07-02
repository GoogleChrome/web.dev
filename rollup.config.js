import resolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';

module.exports = {
  input: 'src/lib/app.mjs',
  output: {
    file: 'dist/bundle.mjs',
    format: 'esm',
  },
  plugins: [
    resolve(),
    commonJs({
      include: 'node_modules/**',
    }),
  ],
};
