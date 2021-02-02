const schedule = require('../src/logic/schedule');
const ctx = require('../src/context');
const logger = ctx.logger;

function start() {
    try {
        schedule.loadJobs();
        logger.info('============test app started=======');
    } catch (err) {
        logger.error('rss', err);
    }
}

module.exports = start;