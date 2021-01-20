const config = require('./config');
global.config = config;
global.consts = require('./src/consts');
global.logger = require('./src/util/logger');
global.config.env = 'test';
const test = require('./test/test');


test();