const amqplib = require('amqplib');
const lodash = require('lodash');
const config = require('./amqp.config.json');

// TODO study channel and the needs to create/close each time we send a message or not necessary

class AMQPEvent {
  constructor() {
    this.conf = config;
    this.amqplib = amqplib;
    this.connection = null;
    this.connect();
  }
  async config(externalConfig = {}) {
    this.conf = lodash.merge(externalConfig, this.conf);
    return this.conf;
  }

  async connect(force = false) {
    try {
      if (force || !this.connection) {
        this.connection = await this.amqplib.connect(this.conf.amqp.server);
      }
      return this.connection;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async amqp() {
    return this.amqplib;
  }

  async emit(exchange = '', message = {}) {
    const connection = await this.connect();
    const ch = await connection.createChannel();
    await ch.assertExchange(exchange, this.conf.exchangeType, { durable: this.conf.durable });
    ch.publish(exchange, '', new Buffer(message));
    ch.close();
  }

  async on(exchange = '', cb) {
    const proccessMsg = (msg) => {
      console.log('message', msg.content.toString(), msg.content);
      cb(msg.content);
    };

    const connection = await this.connect();
    const ch = await connection.createChannel();
    await ch.assertExchange(exchange, this.conf.exchangeType, { durable: this.conf.durable });
    const assertQueue = await ch.assertQueue('', { exclusive: true });
    await ch.bindQueue(assertQueue.queue, 'logs', '');
    ch.consume(assertQueue.queue, proccessMsg, { noAck: this.conf.queue.noAck });
  }

}

module.exports = new AMQPEvent();
