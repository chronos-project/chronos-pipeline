const express = require('express');
const router = express.Router();
const amqp = require('amqplib');

/* GET users listing. */
router.get('/events', function(req, res, next) {
  client.query('SELECT * FROM link_clicks', (err, res) => {
    console.log(err ? err.stack : res.rows[0]) // Hello World!
  });
  res.send([]);
});

router.post('/events', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  let json = req.body;

  try {
    amqp.connect('amqp://localhost').then(conn => {
      return conn.createChannel().then(ch => {
        const ex = 'clientEvents';
        const ok = ch.assertExchange(ex, 'direct', {durable: false});

        return ok.then(() => {
          json.events.forEach(event => {
            const eType = event['eType'];
            event['metadata'] = json.metadata;
            const str = JSON.stringify(event);

            ch.publish(ex, eType, Buffer.from(str));
            console.log(" [x] Sent %s: '%s'", eType, str);
          });

          return ch.close();
        });
      }).finally(() => conn.close());
    }).catch(console.warn);

    res.send(JSON.stringify({"success": true}));
  } catch (e) {
    res.send(JSON.stringify({
      "success": false,
      "error": String(e)
    }));
  }
})

module.exports = router;
