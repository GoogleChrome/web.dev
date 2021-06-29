const functions = require('firebase-functions');
const {EleventyServerless} = require('@11ty/eleventy');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.possum = functions.https.onRequest(async (request, response) => {
  functions.logger.info('Hello logs!', {structuredData: true});
  // return response.send(`You requested path: ${request.path}`);

  const elev = new EleventyServerless('serverless', {
    path: request.path, // required, the URL path
  });

  try {
    // returns the HTML for the Eleventy template that matches to the URL
    const html = await elev.render();
    return response.send(html);
  } catch (e) {
    return response.status(500).send(JSON.stringify({error: e.message}));
  }
});
