const config = require('../config');

module.exports = function requiresAllowedOrigin(req, res, next) {
  if (config.ACCESS_KEY === req.json['ACCESS_KEY']) {
    return next();
  } else {
    res.status(401).send('Unauthorized Access');
  }
};
