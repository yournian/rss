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
        sys: { appenders: ['sys'], level: 'info' },
        default: { appenders: ['console', 'sys'], level: 'info' },
    }
}

const YOUTUBE_KEY = '';

module.exports = {
    log4js,
    YOUTUBE_KEY
}