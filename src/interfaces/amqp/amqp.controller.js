const amqplib = require('amqplib');
const lodash = require('lodash');
const debug = require('debug')('kubide:amqp');
const config = require('./amqp.config.json');

// TODO study channel and the needs to create/close each time we send a message or not necessary
// http://www.squaremobius.net/amqp.node/channel_api.html

class AMQPEvent {
  constructor() {
    this.conf = config;
    this.amqplib = amqplib;
    this.connection = null;
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

  async emit(exchange = '', externalMsg = '') {
    const message = (typeof externalMsg === 'string') ? externalMsg : JSON.stringify(externalMsg);
    const connection = await this.connect();
    const ch = await connection.createChannel();
    await ch.assertExchange(exchange,
      this.conf.amqp.exchangeType,
      { durable: this.conf.amqp.durable });
    ch.publish(exchange, '', new Buffer(message));
    ch.close();
  }

  async on(exchange = '', cb) {
    const proccessMsg = (msg) => {
      if (cb) {
        cb(msg.content.toString(), this);
      }
    };

    const connection = await this.connect();
    const ch = await connection.createChannel();
    await ch.assertExchange(exchange,
      this.conf.amqp.exchangeType,
      { durable: this.conf.amqp.durable });
    const assertQueue = await ch.assertQueue('', { exclusive: true });
    await ch.bindQueue(assertQueue.queue, exchange, '');
    ch.consume(assertQueue.queue, proccessMsg, { noAck: this.conf.amqp.queue.noAck });
  }

}

module.exports = new AMQPEvent();
