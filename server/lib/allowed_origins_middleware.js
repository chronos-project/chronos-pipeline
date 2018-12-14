const config = require('../config');

module.exports = function requiresAllowedOrigin(req, res, next) {
  if (config.ALLOWED_ORIGINS.includes(req.get('Origin'))) {
    return next();
  } else {
    var err = new Error('Unauthorized Access');
    err.status = 401;
    return next(err);
  }
};
