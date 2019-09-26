/**
 * @fileoverview Configures global overrides.
 *
 * Needed to ensure that globals are configured before polyfill loaders are run, as `import`
 * statements are hoisted to the top of the file they're run in.
 */

import config from "webdev_config";

window.WebComponents = {path: config.webcomponentsPath};

export default config;
