let fs = require('fs');
let path = require('path');
let crypto = require('crypto');
let stringify = require('json-beautify');

let url = process.argv[2];

let configFileContents = fs.readFileSync(
  path.resolve(__dirname, '../config.json'),
  { encoding: 'utf8' }
);

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

config['ALLOWED_ORIGINS'] = config['ALLOWED_ORIGINS'] || [];
config['ALLOWED_ORIGINS'] = config['ALLOWED_ORIGINS'].filter((origin) => origin !== url);

fs.writeFileSync(path.resolve(__dirname, '../config.json'), stringify(config, null, 2, 100));
