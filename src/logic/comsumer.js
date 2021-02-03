const HandlerFactory = require('./handler');
const ctx = require('../context');
const logger = ctx.logger;

async function testComsumer(job, done) {
    setTimeout(() => {
        job.progress = 100;
        done(null, 'ok');
    }, 15000)
}

async function devComsumer(job, done) {
    let data = job.data;
    let handler = new HandlerFactory().getHandler(data.type);
    if (!handler) {
        logger.warn('no such handler[%s]', data.type);
        job.progress = 100;
        done('no such handler[%s]', data.type)
    } else {
        try {
            let succeed = await handler.updateFeed(data);
        } catch (err) {
            logger.error('job updateFeed failed', err, JSON.stringify(data));
        }

        job.progress = 100;
        done(null, 'ok');
    }
}

async function procComsumer(job, done) {
    let data = job.data;
    let handler = new HandlerFactory().getHandler(data.type);
    if (!handler) {
        logger.warn('no such handler[%s]', data.type);
        job.progress = 100;
        done('no such handler[%s]', data.type)
    } else {
        try {
            let succeed = await handler.updateFeed(data);
        } catch (err) {
            logger.error('job updateFeed failed', err, JSON.stringify(data));
        }

        job.progress = 100;
        done(null, 'ok');
    }
}

module.exports = {
    testComsumer,
    devComsumer,
    procComsumer
}