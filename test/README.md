# web.dev tests

The `test` directory mirrors the structure of the `src` directory.
The exception to this rule is the `test/integration` directory, which holds
our e2e integration tests.

This structure will continue to evolve as we add more tests and improve our
project directory structure.

## Running tests
The following commands are supported:

```bash
npm test                       # run all tests
npm run test:unit              # run unit tests for components
npm run test:site              # run unit tests for the site build (eleventy)
npm run test:integration       # run integration tests

npm run debug:test:unit        # run component unit tests and leave browser open
npm run debug:test:integration # run integration tests with node debugger attached

npm run watch:test:unit        # run component unit tests in watch mode
```

## Component tests
Unit tests for front-end components use [Karma](https://karma-runner.github.io/)
to run Chrome. A normal test run will run Chrome in headless mode. A debug
test run will actually open a Chrome window and leave it open so you can inspect
the tests.

The tests themselves are written using [mocha](https://mochajs.org/).

The `build.js` file located at the root of the project handles creating the
rollup bundle that karma uses to execute its tests.

## Site tests
Site tests check the filters/transforms/collections/etc. that we've added to
[eleventy](https://11ty.io/). These tests run using mocha.

## Integration tests
The integration tests verify that our eleventy build produces the files we
expect and that changes to eleventy don't cause us to silently stop outputting
certain files (like our sitemap or RSS feed).

These tests run using mocha.

We would like to eventually add puppeteer integration tests to check that
clicking through the site works as expected.

## Percy screenshot tests
In addition to the automated tests mentioned above, we also use
[Percy](https://percy.io) to do screenshot testing of key pages. These tests are run as
part of a GitHub Actions workflow that lives in
`.github/workflows/percy-workflow.yml`.

The code which actually does the snapshotting lives in `tools/percy`.

Percy tests run automatically against every pull request.