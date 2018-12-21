/* eslint-disable-next-line */
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  if (err.message.startsWith('template not found')) {
    return res.status(404).render('404.html', {});
  }
  res.status(500).send({errors: `${err}`});
}

/* eslint-disable-next-line */
function enableCors(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  next();
}

/* eslint-disable-next-line */
function forceSSL(req, res, next) {
  const fromCron = req.get('X-Appengine-Cron');
  if (
    !fromCron &&
    req.hostname !== 'localhost' &&
    req.get('X-Forwarded-Proto') === 'http'
  ) {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  next();
}

/* eslint-disable-next-line */
function addRequestHelpers(req, res, next) {
  req.getCurrentUrl = () =>
    `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  req.getOrigin = () => {
    let protocol = 'https';
    if (req.hostname === 'localhost') {
      protocol = 'http';
    }
    return `${protocol}://${req.get('host')}`;
  };
  next();
}

export default {
  enableCors,
  forceSSL,
  errorHandler,
  addRequestHelpers,
};
