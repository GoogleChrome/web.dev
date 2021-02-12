module.exports = {
  extends: ['./node_modules/gts/.eslintrc.json', 'plugin:lit-a11y/recommended'],
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
    firebase: true,
    ga: true,
  },
  rules: {
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    'lit-a11y/no-invalid-change-handler': 0,
    'new-cap': 0,
    'no-case-declarations': 0,
    'node/no-extraneous-require': 0,
    'node/no-unpublished-import': 0,
    'node/no-unpublished-require': 0,
    'node/no-unsupported-features/es-syntax': 0,
    'node/no-missing-import': [
      'error',
      {
        allowModules: [
          'cache-manifest',
          'layout-template',
          'webdev_analytics',
          'webdev_config',
        ],
      },
    ],
    quotes: [
      'warn',
      'single',
      {avoidEscape: true, allowTemplateLiterals: true},
    ],
    'require-jsdoc': 0,
  },
  overrides: [
    {
      files: ['test/**/*.js'],
      env: {mocha: true},
      rules: {
        'prefer-arrow-callback': 0,
      },
    },
  ],
};
