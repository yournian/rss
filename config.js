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
const DOMAIN = 'http://yournian.top'; 
const PORT = '3030';
const YOUTUBE_KEY = '';

module.exports = {
    DOMAIN,
    PORT,
    log4js,
    YOUTUBE_KEY
}