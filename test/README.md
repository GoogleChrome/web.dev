# web.dev tests

The `test` directory holds two subdirectories, `unit` and `integration`.
The `unit` directory mirrors the structure of the `src` directory.
The `integration` directory somewhat mirrors the structure of `src`, but also includes
additional files and directories for doing full e2e integration tests.

This structure will continue to evolve as we add more tests and improve our
project directory structure. 🚧

## Running tests
The following commands are supported:

```bash
npm test                       # run all tests
npm run test:unit              # run unit tests for eleventy and our front-end js
npm run test:lib               # run unit tests *only* for our front-end js
npm run test:integration       # run integration tests

npm run debug:test:unit        # run eleventy unit tests with node debugger
npm run debug:test:lib         # run front-end unit tests and leave browser open
npm run debug:test:integration # run integration tests with node debugger

npm run watch:test:unit        # run front-end unit tests in watch mode
```

## Writing tests
- Tests should be written using mocha's `describe()/it()` syntax.
- Tests should *not* use arrow functions in the `describe()/it()/etc.` calls, as
these will [mess up mocha's function bindings](https://mochajs.org/#arrow-functions).
- `it()` blocks should explain the expectation for the subject under test using
the "should" vernacular. Examples:
  - `it('should add a trailing slash', function() {...})`
  - `it('should not include search strings', function() {...})`

## Eleventy tests
Eleventy tests check the filters/transforms/collections/etc. that we've added to
[eleventy](https://11ty.io/). These tests run using mocha and Node's built-in
[assert](https://nodejs.org/api/assert.html) module.

## Front-end tests
Unit tests for front-end code use [Karma](https://karma-runner.github.io/)
to run Chrome. A normal test run will run Chrome in headless mode. A debug
test run will actually open a Chrome window and leave it open so you can inspect
the tests.

The tests themselves are written using [mocha](https://mochajs.org/).

The `build.js` file located at the root of the project handles creating the
rollup bundle that karma uses to execute these tests.

Test should use the client-side `assert` helper library located in the
`test/unit/lib` directory.

## Integration tests
The integration tests verify that our eleventy build produces the files we
expect and that changes to eleventy don't cause us to silently stop outputting
certain files (like our sitemap or RSS feed).

These tests run using mocha and Node's built-in
[assert](https://nodejs.org/api/assert.html) module.

We would like to eventually add puppeteer integration tests to check that
clicking through the site works as expected.

## Percy screenshot tests
In addition to the automated tests mentioned above, we also use
[Percy](https://percy.io) to do screenshot testing of key pages. These tests are run as
part of a GitHub Actions workflow that lives in
`.github/workflows/percy-workflow.yml`.

The code which actually does the snapshotting lives in `tools/percy`.

Percy tests run automatically against every pull request that modifies a
non-markdown file (.njk, .css. .js, etc.)