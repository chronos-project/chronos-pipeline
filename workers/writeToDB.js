const { Client } = require('pg');
const config = {
  user: 'postgres',
  host: 'localhost',
  port: '5432',
};
const INSERT = require('./queries');
const timescale = new Client({ database: 'chronos_ts', ...config });
const pipeline = new Client({ database: 'chronos_pl', ...config });

timescale.connect();
pipeline.connect();

const writeToDB = (json) => {
  let { eType, timestamp, metadata } = json;
  timestamp /= 1000;
  let text;
  let values;

  if (eType === 'link_clicks') {
    let { linkText, targetURL } = json;
    text = INSERT.link_click;
    values = [linkText, targetURL, timestamp, metadata];
  } else if (eType === 'clicks') {
    let { target_node, buttons, x, y } = json;
    text = INSERT.click;
    values = [target_node, buttons, x, y, timestamp, metadata];
  } else if (eType === 'mouse_moves') {
    let { x, y } = json;
    text = INSERT.mouse_move;
    values = [x, y, timestamp, metadata];
  } else if (eType === 'key_presses') {
    let { key } = json;
    text = INSERT.key_press;
    values = [key, timestamp, metadata];
  } else if (eType === 'pageviews') {
    let { url, title } = json;
    // console.log(url, title);
    text = INSERT.pageview;
    values = [url, title, timestamp, metadata];
  } else if (eType === 'form_submissions') {
    let { data } = json;
    text = INSERT.form_submission;
    values = [data, timestamp, metadata];
  }

  timescale.query(text, values, (err, res) => {
    console.log(err ? err.stack : res.rows[0]);
  });
}

module.exports = writeToDB;
