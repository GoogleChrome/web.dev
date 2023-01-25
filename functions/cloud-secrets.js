import {SecretManagerServiceClient} from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

/** @type {{ [key: string]: string }} */
const secrets = {};

/**
 * @returns {Promise<{ [key: string]: string }>}
 */
const cloudSecrets = async () => {
  if (!process.env.FIREBASE_CONFIG) {
    console.warn('No Firebase Config found, no secrets are being returned.');
    return secrets;
  }

  if (Object.keys(secrets).length !== 0) {
    return secrets;
  }

  const PROJECT_ID = JSON.parse(process.env.FIREBASE_CONFIG).projectId;

  const project = `projects/${PROJECT_ID}`;
  const [secretsList] = await client.listSecrets({parent: project});

  for (const secretItem of secretsList) {
    const key = (secretItem.name || '').split('/').pop() || '';
    const [versions] = await client.listSecretVersions({
      parent: secretItem.name,
    });
    const version = versions.find((v) => v.state === 'ENABLED');

    if (version) {
      const [accessedSecret] = await client.accessSecretVersion({
        name: version.name,
      });
      let data = '';
      if (accessedSecret.payload && accessedSecret.payload.data) {
        data = accessedSecret.payload.data.toString();
      }
      secrets[key] = data;
    }
  }

  return secrets;
};

export default cloudSecrets;
