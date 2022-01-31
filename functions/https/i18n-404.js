import * as functions from 'firebase-functions';
import supportedLocales from '../supportedLocales.js';

export const i18n404 = functions.https.onRequest((request, response) => {
  const path = request.path.split('/');

  // Redirect for locales
  if (supportedLocales.includes(path[2])) {
    response.redirect(`/${path.splice(3).join('/')}`, 301);
  } else {
    // Redirect for everything else
    response.redirect(`/${path.splice(2).join('/')}`, 301);
  }
});
