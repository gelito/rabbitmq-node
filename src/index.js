const debug = require('debug')('kubide:main-access');

debug('hi', process.env.NODE_PATH);
console.log('log', process.env.NODE_PATH);
