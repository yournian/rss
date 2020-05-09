const config = require('../config');
const logger = require('log4js').configure(config.log4js);

module.exports = logger;