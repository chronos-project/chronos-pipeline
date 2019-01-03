/* DB Configurations */
const { Client } = require('pg');
const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};
const INSERT = require('./queries');
const timescale = new Client({ database: process.env.TSDATABASE, host: process.env.TSHOST, ...config });
const pipeline = new Client({ database: process.env.PLDATABASE, host: process.env.PLHOST, ...config });

timescale.connect()
.catch(error => console.log(error));
pipeline.connect()
.catch(error => console.log(error));

/* Write to Databases */
const writeToDB = (event) => {
  let metadata = event[event.length - 1];
  let eType = event[0];
  let timestamp = event[event.length - 2];
  timestamp /= 1000;
  let text;
  let values;

  if (eType === 'link_clicks') {
    let [ linkText, targetURL ] = [event[1], event[2]];
    text = INSERT.link_click;
    values = [linkText, targetURL, timestamp, metadata];
  } else if (eType === 'clicks') {
    let [ target_node, buttons, x, y ] = [event[1], event[2], event[3], event[4]];
    text = INSERT.click;
    values = [target_node, buttons, x, y, timestamp, metadata];
  } else if (eType === 'mouse_moves') {
    let [ x, y ] = [event[1], event[2]];
    text = INSERT.mouse_move;
    values = [x, y, timestamp, metadata];
  } else if (eType === 'key_presses') {
    let key = event[1];
    text = INSERT.key_press;
    values = [key, timestamp, metadata];
  } else if (eType === 'pageviews') {
    let [ url, title ] = [event[1], event[2]];
    // console.log(url, title);
    text = INSERT.pageview;
    values = [url, title, timestamp, metadata];
  } else if (eType === 'form_submissions') {
    let data = event[1];
    text = INSERT.form_submission;
    values = [data, timestamp, metadata];
  }

  timescale.query(text, values, (err, res) => {
    console.log(err ? err.stack : res.rows[0]);
  });

  pipeline.query(text, values, (err, res) => {
    console.log(err ? err.stack : res.rows[0]);
  });
}

module.exports = writeToDB;
