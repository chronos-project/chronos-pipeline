var amqp = require('amqplib');
var all = require('bluebird').all;
var basename = require('path').basename;
var writeToPL = require('./addToPL');

const events = ['clicks', 'link_clicks', 'key_press', 'mouse_moves', 'pageview', 'form_submissions'];

amqp.connect('amqp://localhost').then(conn => {
  process.once('SIGINT', () => conn.close());
  return conn.createChannel().then(ch => {
    const ex = 'events';

    let ok = ch.assertExchange(ex, 'direct', {durable: false});

    ok = ok.then(() => ch.assertQueue('', {exclusive: true}));

    ok = ok.then(qok => {
      const queue = qok.queue;

      return all(events.map(event => ch.bindQueue(queue, ex, event))).then(() => queue);
    });

    ok = ok.then(queue => ch.consume(queue, writeToPL, {noAck: true}));

    return ok.then(() => console.log(' [*] Waiting for logs. To exit press CTRL+C.'));
  });
}).catch(console.warn);