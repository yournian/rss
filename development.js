const config = require('./config');
global.config = config;
global.consts = require('./src/consts');
global.logger = require('./src/util/logger');
global.isDev = true;
const app = require('./src/app');


app.start();