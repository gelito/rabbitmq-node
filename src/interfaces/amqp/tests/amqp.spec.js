/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const should = require('chai').should();
const debug = require('debug')('kubide:test:amqp');
const shortid = require('shortid');
const amqp = require('../.');

describe('basic usage', () => {
  before(async () => {
    channel = shortid();
    debug(`Start test: channel ${channel}`);
    msg = { text: shortid() };
  });

  it('Connect with AMQP', async () => {
    await amqp.connect();
  });

  it('Suscribe to a channel', async () => {
    await amqp.on(channel, (element, amqpobject) => {
      debug(element);
      debug(amqpobject);
    });
  });

  it('Emit a message to a channel', async () => {
    await amqp.emit(channel, msg);
  });
});

/* eslint-enable no-unused-vars */
/* eslint-enable no-undef */
