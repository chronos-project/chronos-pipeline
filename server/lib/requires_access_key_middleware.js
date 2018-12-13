const config = require('../config');

module.exports = function requiresAllowedOrigin(req, res, next) {
  if (config.ACCESS_KEY === req.body['ACCESS_KEY']) {
    return next();
  } else {
    var err = new Error('Unauthorized Access');
    err.status = 401;
    return next(err);
  }
};
