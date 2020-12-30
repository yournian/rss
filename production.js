const config = require('./config.production');
global.config = config;
global.consts = require('./src/consts');
global.logger = require('./src/util/logger');
const app = require('./src/app');


app.start();