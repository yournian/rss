let level = require('../config.json').logLevel;
level = level ? level : 'info';

const config = {
    appenders: {
        sys: {
            type: 'dateFile',
            filename: './log/sys.log',
            pattern: '.yyyy-MM-dd-hh',
            daysToKeep: 28,   //保留1个月
        },
        console: {
            type: 'console'
        }
    },
    categories: {
        sys: { appenders: ['sys'], level: level },
        default: { appenders: ['console', 'sys'], level: level },
    }
}

const log4js = require('log4js').configure(config);
const logger = log4js.getLogger(); //default

module.exports = logger;