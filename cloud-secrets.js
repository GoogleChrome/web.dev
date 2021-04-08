/**
 * @fileoverview This file generates a `.env` file from the lastest active secrets stored
 * in the Google Cloud Secret Manager. This is ran from the Cloud Build Deploy script.
 */

const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');

const client = new SecretManagerServiceClient();

const cloudSecrets = async () => {
  if (!process.env.PROJECT_ID) {
    return console.warn(
      'No Google Cloud Project ID found, no .env file is being generated.',
    );
  }

  console.log('Generating .env file.');

  const project = `projects/${process.env.PROJECT_ID}`;
  let dotenv = '';
  const fetchedSecrets = [];
  const [secretsList] = await client.listSecrets({parent: project});

  for (const secretItem of secretsList) {
    const key = secretItem.name.split('/').pop();
    const [versions] = await client.listSecretVersions({
      parent: secretItem.name,
    });
    const version = versions.find((v) => v.state === 'ENABLED');

    if (version) {
      const [accessedSecret] = await client.accessSecretVersion({
        name: version.name,
      });
      const value = accessedSecret.payload.data.toString();
      dotenv += `${key}=${value}\n`;
      fetchedSecrets.push(key);
    }
  }

  require('fs').writeFileSync('.env', dotenv);

  console.log(
    `The following environment variables have been added to the generated .env file: ${fetchedSecrets.join(
      ', ',
    )}`,
  );
};

cloudSecrets().catch((e) => {
  console.warn('Ooops, there was an error in generating the .env file.', e);
});
