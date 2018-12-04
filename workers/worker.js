const writeToDB = require('./writeToDB');
const { Consumer } = require('sinek');
const kafkaConfig = require('../kafkaConfig');
const consumer = new Consumer('events', kafkaConfig);
const withBackpressure = true;

const events = ['link_clicks', 'clicks', 'mouse_moves', 'key_presses', 'pageviews', 'form_submissions'];

// console.log(process.env['PGDATABASE']);

consumer.connect(withBackpressure).then(_ => {
  consumer.consume((message, callback) => {
    console.log(typeof message.value);
    console.log(message);
    callback();
  });
});

consumer.on('error', error => console.log(error));
