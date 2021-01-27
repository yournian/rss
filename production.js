const config = require('./config.production');
global.config = config;
const db = require('./src/util/db');
global.consts = require('./src/consts');
global.logger = require('./src/util/logger');
global.models = db.init(config.mysql);


const app = require('./src/app');
app.start();
