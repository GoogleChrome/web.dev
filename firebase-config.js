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

fs.writeFileSync('./firebase.json', JSON.stringify(firebaseJson, null, 2));
