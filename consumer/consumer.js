const writeToDB = require('./writeToDB');
const { Consumer } = require('sinek');
const kafkaConfig = require('./kafkaConfig');
const consumer = new Consumer('events', kafkaConfig);
const withBackpressure = true;

consumer.connect(withBackpressure).then(_ => {
  consumer.consume((message, callback) => {
    const json = JSON.parse(message.value);
    const { events, metadata } = json;

    events.forEach(event => {
      event.push(metadata);
      writeToDB(event);
    });

    callback();
  });
});

consumer.on('error', error => console.log(error));
