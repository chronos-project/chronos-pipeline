const express = require('express');
const router = express.Router();

/* Kafka Producer Configuration */
const { Producer } = require('sinek');
const kafkaConfig = require('./kafkaConfig');
const partitions = 6;
const compressionType = 0; // no compression
const topic = 'events';
const producer = new Producer(kafkaConfig, topic, partitions);

producer.connect();
producer.on('error', error => console.log(error));
process.on('warning', e => console.warn(e.stack));

/* GET users listing. */
router.get('/events', function(req, res, next) {
  client.query('SELECT * FROM link_clicks', (err, res) => {
    console.log(err ? err.stack : res.rows[0]) // Hello World!
  });
  res.send([]);
});

/* Tracker API Endpoint */
router.post('/events', (req, res) => {
  try {
    const json = req.json['data'];

    producer.buffer(topic, undefined, { json }, compressionType);
    res.json({"success": true});
  } catch (e) {
    res.send(JSON.stringify({
      "success": false,
      "error": String(e)
    }));
  }
});

module.exports = router;
