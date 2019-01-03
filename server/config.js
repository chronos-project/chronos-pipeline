let fs = require('fs');

let configFileContents = fs.readFileSync('./config.json', { encoding: 'utf8' });

let config;

if (configFileContents.trim() === '') {
  config = {};
}

try {
  config = JSON.parse(configFileContents);
} catch(e) {
  console.log('Invalid JSON in config.json; resetting configuration')
  config = {};
}

module.exports = JSON.parse(configFileContents);
