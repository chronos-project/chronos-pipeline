// const amqp = require('amqplib');
// const all = require('bluebird').all;
// const basename = require('path').basename;
const writeToDB = require('./writeToDB');
const { Consumer } = require('sinek');
const kafkaConfig = {
  kafkaHost: "localhost:9092,localhost:9093,localhost:9094",
  logger: {
      debug: msg => console.log(msg),
      info: msg => console.log(msg),
      warn: msg => console.log(msg),
      error: msg => console.log(msg)
  },
  groupId: "test-group",
  clientName: "chronos-kafka",
  workerPerPartition: 1,
  options: {
      sessionTimeout: 8000,
      protocol: ["roundrobin"],
      fromOffset: "earliest", //latest
      fetchMaxBytes: 1024 * 100,
      fetchMinBytes: 1,
      fetchMaxWaitMs: 10,
      heartbeatInterval: 250,
      retryMinTimeout: 250,
      autoCommit: false, //if you set this to false and run with backpressure the consumer will commit on every successfull batch
      autoCommitIntervalMs: 1000,
      requireAcks: 0,
      ackTimeoutMs: 100,
      partitionerType: 3,
      encoding: 'utf8',
      keyEncoding: 'utf8'
  }
};
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

// amqp.connect('amqp://localhost').then(conn => {
//   process.once('SIGINT', () => conn.close());
//   return conn.createChannel().then(ch => {
//     const ex = 'clientEvents';
//     let ok = ch.assertExchange(ex, 'direct', {durable: false});
//     ok = ok.then(() => ch.assertQueue('', {exclusive: true}));
//     ok = ok.then(qok => {
//       const queue = qok.queue;
//
//       return all(events.map(event => ch.bindQueue(queue, ex, event))).then(() => queue);
//     });
//     ok = ok.then(queue => ch.consume(queue, writeToDB, {noAck: true}));
//
//     return ok.then(() => console.log(' [*] Waiting for logs. To exit press CTRL+C'));
//   });
// }).catch(console.warn);
