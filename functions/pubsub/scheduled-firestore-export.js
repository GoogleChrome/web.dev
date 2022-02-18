import * as functions from 'firebase-functions';
import firestore from '@google-cloud/firestore';

const client = new firestore.v1.FirestoreAdminClient();
const bucket = 'gs://web-dev-production-firestore-archive';

/**
 * Copies over all collections from Firestore to GCP Bucket
 * at 19:00 UTC / 7:00 PST on every Monday.
 */
export const scheduledFirestoreExport = functions.pubsub
  .schedule('0 19 * * 1')
  .onRun(() => {
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
    const databaseName = client.databasePath(projectId, '(default)');
    const collectionIds = [];

    return client
      .exportDocuments({
        name: databaseName,
        outputUriPrefix: bucket,
        collectionIds,
      })
      .then((responses) => {
        const response = responses[0];
        console.log(`Operation Name: ${response['name']}`);
        console.log(
          `Successfully backed up ${
            collectionIds.length === 0 ? 'all' : collectionIds.join(', ')
          } Firestore Collections for ${projectId}`,
        );
      })
      .catch((err) => {
        console.error(err);
        throw new Error('Export operation failed');
      });
  });
