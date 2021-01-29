let defalulLvl = 'info';
const log4js = require('log4js')


function init(config){
    let level = config.logLvl;
    level = level ? level : defalulLvl;
    const conf = {
        appenders: {
            sys: {
                type: 'dateFile',
                filename: './log/sys.log',
                pattern: '.yyyy-MM-dd',
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
    log4js.configure(conf);
    const logger = log4js.getLogger(); //default
    return logger;
}


module.exports = {init};