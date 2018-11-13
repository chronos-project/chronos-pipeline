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
  let { eType, timestamp, metadata } = json;
  let text;
  let values;
  timestamp = moment.utc(timestamp).format();

  if (eType === 'link_clicks') {
    let { linkText, targetURL } = json;

    text = 'INSERT INTO link_clicks(link_text, target_url, local_time, metadata) VALUES ($1, $2, $3, $4) RETURNING *';
    values = [linkText, targetURL, timestamp, metadata];

    client.query(text, values, (err, res) => {
      console.log(err ? err.stack : res.rows[0]);
    });
  } else if (eType === 'clicks') {
    let { target_node, buttons, x, y } = json;

    text = 'INSERT INTO clicks(target_node, buttons, x, y, local_time, metadata) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    values = [target_node, buttons, x, y, timestamp, metadata];

    client.query(text, values, (err, res) => {
      console.log(err ? err.stack : res.rows[0]);
    });
  } else if (eType === 'mouse_moves') {
    let { x, y } = json;

    text = 'INSERT INTO mouse_moves(x, y, local_time, metadata) VALUES ($1, $2, $3, $4) RETURNING *';
    values = [x, y, timestamp, metadata];

    client.query(text, values, (err, res) => {
      console.log(err ? err.stack : res.rows[0]);
    });
  }
}

module.exports = writeToDB;
