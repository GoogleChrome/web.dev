/**
 * @fileoverview Invokes snapshots but ensures that headless mode is disabled,
 * for building new Percy tests.
 */
process.env.WEBDEV_PERCY_DEV = "yes";
require("./snapshots.js");
