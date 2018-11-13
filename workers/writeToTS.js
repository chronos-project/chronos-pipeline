const { Client } = require('pg');
const client = new Client({
  user: 'nick',
  host: 'localhost',
  database: 'chronos_ts',
  port: '5432',
});
client.connect();
const moment = require('moment');

const writeToDB = (msg) => {
  const json = JSON.parse(msg.content);
  // console.log(json);
  let { timestamp, metadata } = json;
  timestamp = moment.utc(timestamp).format();

  switch (json['eType']) {
    case 'link_clicks':
      let { linkText, targetURL } = json;

      const text = 'INSERT INTO link_clicks(link_text, target_url, local_time, metadata) VALUES ($1, $2, $3, $4) RETURNING *';
      const values = [linkText, targetURL, timestamp, metadata];

      client.query(text, values, (err, res) => {
        console.log(err ? err.stack : res.rows[0]);
      });
      break;
    case 'clicks':
      // let { target_node, buttons, x, y }
      break;
    default:
  }
}

module.exports = writeToDB;
