let fs = require('fs');

let configFileContents = fs.readFileSync('./config.json');

let config;

if (configFileContents.trim() === '') {
  config = {};
}

try {
  config = JSON.parse(configFileContents);
} catch {
  console.log('Invalid JSON in config.json; resetting configuration')
  config = {};
}

module.exports = JSON.parse(configFileContents);