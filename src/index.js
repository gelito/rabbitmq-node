const debug = require('debug')('kubide:main-access');
const amqp = require('interfaces/amqp');

const senderChannel = process.env.PROCESS === '1' ? 'ping' : 'pong';
const receiverChannel = process.env.PROCESS === '1' ? 'pong' : 'ping';

debug(`Start game as process ${process.env.PROCESS} send to: ${senderChannel} receive from: ${receiverChannel}`);

setTimeout(() => {
  amqp.on(receiverChannel, (element) => {
    debug(`received the ${element} from ${receiverChannel}`);
    const nextMsg = Number(element) + 1;

    debug(`emit to ${nextMsg} to ${senderChannel}`);
    amqp.emit(senderChannel, nextMsg);
  });
}, 3000);

if (process.env.PROCESS === '2') {
  setTimeout(() => {
    debug(`emit 1 to ${senderChannel}`);
    amqp.emit(senderChannel, 1);
  }, 10000);
}
