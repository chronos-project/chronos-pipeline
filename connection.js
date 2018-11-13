const { Client } = require('pg');
const client = new Client();

client.connect();

module.exports = client;
