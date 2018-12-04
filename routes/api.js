const express = require('express');
const router = express.Router();
const client = require('../connection');

/* Kafka Producer Configuration */
const { Producer } = require('sinek');
const kafkaConfig = require('../kafkaConfig');
const partitions = 6;
const compressionType = 0; // no compression
const topic = 'events';
const producer = new Producer(kafkaConfig, topic, partitions);

producer.connect();
producer.on('error', error => console.log(error));

/* GET users listing. */
router.get('/events', function(req, res, next) {
  client.query('SELECT * FROM link_clicks', (err, res) => {
    console.log(err ? err.stack : res.rows[0]) // Hello World!
  });
  res.send([]);
});

/* Tracker API Endpoint */
router.post('/events', (req, res) => {
  const json = req.body;

  try {
    producer.buffer(topic, undefined, { json }, compressionType);

    res.send(JSON.stringify({"success": true}));
  } catch (e) {
    res.send(JSON.stringify({
      "success": false,
      "error": String(e)
    }));
  }
});

// router.post('/events/mousemoves', (req, res, next) => {
//   const json = JSON.parse(req.body);
//   const events = json.eventAttrs;
//   const { metadata } = json;
//
//   events.forEach(event => {
//     let { x, y, timestamp } = event;
//     timestamp = moment.utc(timestamp).format();
//     const text = 'INSERT INTO mouse_moves(x, y, local_time, metadata) VALUES ($1, $2, $3, $4) RETURNING *';
//     const values = [x, y, timestamp, metadata]
//
//     client.query(text, values, (err, res) => {
//       console.log(err ? err.stack : res.rows[0]);
//     });
//   })
//
//   res.send('');
// })
//
// router.post('/testing', (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   let json = req.body;
//
//   try {
//     json.events.forEach(event => {
//       const eType = event['eType'];
//       event['metadata'] = json.metadata;
//
//       amqp.connect('amqp://localhost').then(conn => {
//         return conn.createChannel().then(ch => {
//           const ex = 'clientEvents';
//           const ok = ch.assertExchange(ex, 'direct', {durable: false});
//
//           return ok.then(() => {
//             ch.publish(ex, eType, Buffer.from(JSON.stringify(event)));
//             console.log(" [x] Sent %s: '%s'", eType, JSON.stringify(event));
//             return ch.close();
//           });
//         }).finally(() => conn.close());
//       }).catch(console.warn);
//     });
//
//
//   } catch (e) {
//
// })

module.exports = router;
