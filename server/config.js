module.exports = {
  ALLOWED_ORIGINS: process.env['ALLOWED_ORIGINS'].split(',').map(url => url.trim())
}
