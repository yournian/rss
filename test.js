const config = require('./config');
global.config = config;
const db = require('./src/util/db');
global.consts = require('./src/consts');
global.logger = require('./src/util/logger');
global.config.env = 'test';
global.models = db.init(config.mysql);

const test = require('./test/test');
test();