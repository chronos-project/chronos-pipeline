var express = require('express');
var router = express.Router();
var client = require('../connection');
var moment = require('moment');
var amqp = require('amqplib');
let size = 0;

/* GET users listing. */
router.get('/events', function(req, res, next) {
  client.query('SELECT * FROM link_clicks', (err, res) => {
    console.log(err ? err.stack : res.rows[0]) // Hello World!
  });
  res.send([]);
});

router.post('/events', (req, res) => {
  const json = JSON.parse(req.body);
  console.log(req.body);
  // let { eType, linkText, targetURL, timestamp } = json.eventAttrs;
  // timestamp = moment.utc(timestamp).format();
  //
  // const text = 'INSERT INTO link_clicks(link_text, target_url, local_time) VALUES ($1, $2, $3) RETURNING *';
  // const values = [linkText, targetURL, timestamp];
  //
  // const text2 = 'INSERT INTO metadata(url, user_agent, page_title, cookie_allowed, language, event_type, event_id, time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
  // let fres;
  //
  // client.query(text, values, (err, res) => {
  //   console.log(err ? err.stack : res.rows[0]);
  //   if (res) {
  //     fres = res.rows[0];
  //     const {url, userAgent, pageTitle, cookieAllowed, language} = json.metadata;
  //     console.log(json.metadata.uuid);
  //
  //     const values2 = [url, userAgent, pageTitle, cookieAllowed, language, eType, fres.id, timestamp];
  //
  //     client.query(text2, values2, (err, res) => {
  //       console.log(err ? err.stack : res.rows[0]);
  //     })
  //   }
  // });

  res.send('');
})

router.post('/events/mousemoves', (req, res, next) => {
  const json = JSON.parse(req.body);
  const events = json.eventAttrs;
  const { metadata } = json;

  events.forEach(event => {
    let { x, y, timestamp } = event;
    timestamp = moment.utc(timestamp).format();
    const text = 'INSERT INTO mouse_moves(x, y, local_time, metadata) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [x, y, timestamp, metadata]

    client.query(text, values, (err, res) => {
      console.log(err ? err.stack : res.rows[0]);
    });
  })

  res.send('');
})

router.post('/testing', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  let json = req.body;

  try {
    json.events.forEach(event => {
      const eType = event['eType'];
      event['metadata'] = json.metadata;

      amqp.connect('amqp://localhost').then(conn => {
        return conn.createChannel().then(ch => {
          const ex = 'clientEvents';
          const ok = ch.assertExchange(ex, 'direct', {durable: false});

          return ok.then(() => {
            ch.publish(ex, eType, Buffer.from(JSON.stringify(event)));
            console.log(" [x] Sent %s: '%s'", eType, JSON.stringify(event));
            return ch.close();
          });
        }).finally(() => conn.close());
      }).catch(console.warn);
    });

    res.send(JSON.stringify({"success": true}));
  } catch (e) {
    res.send(JSON.stringify({
      "success": false,
      "error": String(e)
    }));
  }
})

module.exports = router;
