const amqp = require('amqplib');
const all = require('bluebird').all;
const basename = require('path').basename;
const writeToDB = require('./writeToTS');



const events = ['link_clicks'];
// 'clicks', 'mouse_moves', 'key_presses', 'form_submissions', 'pageviews'];

amqp.connect('amqp://localhost').then(conn => {
  process.once('SIGINT', () => conn.close());
  return conn.createChannel().then(ch => {
    const ex = 'clientEvents';
    let ok = ch.assertExchange(ex, 'direct', {durable: false});
    ok = ok.then(() => ch.assertQueue('', {exclusive: true}));
    ok = ok.then(qok => {
      const queue = qok.queue;

      return all(events.map(event => ch.bindQueue(queue, ex, event))).then(() => queue);
    });
    ok = ok.then(queue => ch.consume(queue, writeToDB, {noAck: true}));

    return ok.then(() => console.log(' [*] Waiting for logs. To exit press CTRL+C'));
  });
}).catch(console.warn);
