# Testing the lib directory

The lib tests check our front-end code (web components, utils, etc).
These tests are run by Karma and therefore cannot use the Node assert module.
Instead, we've implemented our own basic assert function which lives in the
lib test directory.

Note that these tests must be bundled by rollup along with the rest of our
client code. We do this bundling step in `build.js`.