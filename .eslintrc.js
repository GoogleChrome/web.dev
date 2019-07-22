module.exports = {
  plugins: [
    "prettier",
  ],
  extends: [
    "eslint-config-prettier", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier.
    "google", // Uses google style guide for js.
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  env: {
    es6: true,
    node: true,
    mocha: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  globals: {
    "customElements": true,
  },
  rules: {
    "indent": [
      "error",
      2,
      {
        SwitchCase: 1,
      },
    ],
    "new-cap": 0,
    "require-jsdoc": 0,
  },
};
