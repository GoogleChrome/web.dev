const yaml = require('js-yaml');
const fs = require('fs');

const redirectsYaml = fs.readFileSync('./redirects.yaml', 'utf8');
const {redirects} = yaml.safeLoad(redirectsYaml);

const firebaseJson = require('./firebase.json');
firebaseJson.hosting.redirects = redirects.map((r) => ({...r, type: 301}));

fs.writeFileSync('./firebase.json', JSON.stringify(firebaseJson, null, 2));
