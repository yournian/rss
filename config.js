const log4js = {
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
        sys: { appenders: ['sys'], level: 'debug' },
        default: { appenders: ['console', 'sys'], level: 'debug' },
    }
}

module.exports = {
    log4js
}