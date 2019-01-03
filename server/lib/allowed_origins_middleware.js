const config = require('../config');

module.exports = function requiresAllowedOrigin(req, res, next) {
  if (config.ALLOWED_ORIGINS.includes(req.get('Origin')) || !req.get('Origin')) {
    return next();
  } else {
    res.status(401).send('Unauthorized Access');
  }
};
