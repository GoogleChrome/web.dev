module.exports = {
  extends: ['./node_modules/gts/.eslintrc.json'],
  env: {
    es6: true,
    node: true,
    mocha: true,
    browser: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  globals: {
    customElements: true,
  },
  rules: {
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    'new-cap': 0,
    'require-jsdoc': 0,
    'node/no-unpublished-require': 0,
  },
};
