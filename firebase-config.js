const yaml = require('js-yaml');
const fs = require('fs');

const redirectsYaml = fs.readFileSync('./redirects.yaml', 'utf8');
const {redirects: parsedRedirects} = yaml.safeLoad(redirectsYaml);
const {defaultLocale, supportedLocales} = require('./shared/locale.js');
const firebaseJson = require('./firebase.incl.json');

const redirects = [];

// YAML defined redirects
for (const redirect of parsedRedirects) {
  const type = [301, 302].includes(redirect.type) ? redirect.type : 301;
  if (redirect.source && redirect.destination) {
    redirects.push({
      source: redirect.source,
      destination: redirect.destination,
      type,
    });
  }
}

// i18n redirects
for (const locale of supportedLocales) {
  firebaseJson.hosting.redirects.push({
    source: `/${locale}/:path*`,
    destination: locale === defaultLocale ? `/:path` : `/i18n/${locale}/:path`,
    type: 301,
  });
}

firebaseJson.hosting.redirects = redirects;

if (process.env.ELEVENTY_ENV === 'prod') {
  const hashListJson = fs.readFileSync('dist/script-hash-list.json', 'utf-8');
  const hashList = JSON.parse(hashListJson);
  firebaseJson.hosting.headers[0].headers.push({
    key: 'Content-Security-Policy',
    value:
      `script-src 'strict-dynamic' ${hashList.join(' ')} ` +
      `'unsafe-inline' http: https:; object-src 'none'; base-uri 'self'; ` +
      `frame-ancestors 'self'; ` +
      `report-uri https://csp.withgoogle.com/csp/webdev`,
  });
  firebaseJson.hosting.headers[0].headers.push({
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  });
}

fs.writeFileSync('./firebase.json', JSON.stringify(firebaseJson, null, 2));
fs.writeFileSync(
  './functions/supportedLocales.js',
  `export default ${JSON.stringify(supportedLocales)};`,
);
