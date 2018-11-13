const { Client } = require('pg');
const client = new Client({
  user: 'nick',
  host: 'localhost',
  database: 'chronos_ts',
  port: '5432',
});
client.connect();

const writeToDB = (msg) => {
  const json = JSON.parse(msg.content);
  let { eType, timestamp, metadata } = json;
  timestamp = timestamp / 1000;
  let text;
  let values;

  if (eType === 'link_clicks') {
    let { linkText, targetURL } = json;

    text = 'INSERT INTO link_clicks(link_text, target_url, client_time, metadata) VALUES ($1, $2, to_timestamp($3), $4) RETURNING *';
    values = [linkText, targetURL, timestamp, metadata];

    client.query(text, values, (err, res) => {
      console.log(err ? err.stack : res.rows[0]);
    });
  } else if (eType === 'clicks') {
    let { target_node, buttons, x, y } = json;

    text = 'INSERT INTO clicks(target_node, buttons, x, y, client_time, metadata) VALUES ($1, $2, $3, $4, to_timestamp($5), $6) RETURNING *';
    values = [target_node, buttons, x, y, timestamp, metadata];

    client.query(text, values, (err, res) => {
      console.log(err ? err.stack : res.rows[0]);
    });
  } else if (eType === 'mouse_moves') {
    let { x, y } = json;

    text = 'INSERT INTO mouse_moves(x, y, client_time, metadata) VALUES ($1, $2, to_timestamp($3), $4) RETURNING *';
    values = [x, y, timestamp, metadata];

    client.query(text, values, (err, res) => {
      console.log(err ? err.stack : res.rows[0]);
    });
  } else if (eType === 'key_presses') {
    let { key } = json;

    text = 'INSERT INTO key_presses(key, client_time, metadata) VALUES ($1, to_timestamp($2), $3) RETURNING *';
    values = [key, timestamp, metadata];

    client.query(text, values, (err, res) => {
      console.log(err ? err.stack : res.rows[0]);
    });
  } else if (eType === 'pageviews') {
    let { url, title } = json;

    text = 'INSERT INTO pageviews(url, title, client_time, metadata) VALUES ($1, $2, to_timestamp($3), $4) RETURNING *';
    values = [url, title, timestamp, metadata];

    client.query(text, values, (err, res) => {
      console.log(err ? err.stack : res.rows[0]);
    });
  } else if (eType === 'form_submissions') {
    let { data } = json;

    text = 'INSERT INTO form_submissions(data, client_time, metadata) VALUES ($1, to_timestamp($2), $3) RETURNING *';
    values = [data, timestamp, metadata];

    client.query(text, values, (err, res) => {
      console.log(err ? err.stack : res.rows[0]);
    });
  }
}

module.exports = writeToDB;
