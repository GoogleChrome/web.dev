// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.scheduledFirestoreExport =
  require('./pubsub/scheduled-firestore-export').scheduledFirestoreExport;
