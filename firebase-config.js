const yaml = require('js-yaml');
const fs = require('fs');

const redirectsYaml = fs.readFileSync('./redirects.yaml', 'utf8');
const {redirects: parsedRedirects} = yaml.safeLoad(redirectsYaml);

const firebaseJson = require('./firebase.incl.json');
firebaseJson.hosting.redirects = parsedRedirects.reduce(
  (redirects, redirect) => {
    if (redirect.source && redirect.destination) {
      redirects.push({
        source: redirect.source,
        destination: redirect.destination,
        type: 301,
      });
    }
    return redirects;
  },
  [],
);

// Enforce CSP for hashed resources.
const hashListJson = fs.readFileSync('dist/script-hash-list.json', 'utf-8');
const hashList = JSON.parse(hashListJson);
firebaseJson.hosting.headers[0].headers.push({
  key: 'Content-Security-Policy-Report-Only',
  value:
    `script-src 'strict-dynamic' ${hashList.join(' ')} ` +
    `'unsafe-inline' http: https:; object-src 'none'; base-uri 'self'; ` +
    `report-uri https://csp.withgoogle.com/csp/webdev`,
});

fs.writeFileSync('./firebase.json', JSON.stringify(firebaseJson, null, 2));
