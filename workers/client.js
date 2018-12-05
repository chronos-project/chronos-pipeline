const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'chronos_ts',
  port: '5432',
});
client.connect();

module.exports = client;
