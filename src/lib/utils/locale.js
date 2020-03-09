

const fs = require("fs");
const localeCode = require("iso-639-1");
const path = require("path");

const defaultLocale = require("../../site/_data/site").defaultLocale;
const isProd = Boolean(process.env.GAE_APPLICATION);
const contentDir = isProd ? "../../dist" : "../../site/content";
const dirs = fs.readdirSync(path.join(__dirname, contentDir));
const supportedLocales = dirs.filter((dir) => localeCode.validate(dir));

const isSupportedLocale = (locale) => supportedLocales.indexOf(locale) > -1;

module.exports = {
    defaultLocale,
    supportedLocales,
    isSupportedLocale
}