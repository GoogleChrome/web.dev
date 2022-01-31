import * as functions from 'firebase-functions';

export const i18n404 = functions.https.onRequest((request, response) => {
  if (request.path === '/i18n/') {
    response.redirect('/', 301);
  } else {
    const path = request.path.split('/');
    response.redirect(`/${path.splice(3).join('/')}`, 301);
  }
});
