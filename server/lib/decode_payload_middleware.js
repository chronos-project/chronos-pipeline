const Serializer = require('./serializer');

module.exports = function requiresAllowedOrigin(req, res, next) {
  const binary = Serializer.bufferToString(req.body);
  const string = Serializer.decode(binary);

  try {
    const json = JSON.parse(string);
    console.log(json);

    req.json = json;
    return next();
  } catch (e) {
    res.send(400);
  }
};
