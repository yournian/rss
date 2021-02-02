const HandlerFactory = require('./handler');
const logger = require('../context').logger;
const MyQueue = require('../util/queue');
const ctx = require('../context');


async function myJob(job, done) {
    if (ctx.isTest()) {
        setTimeout(() => {
            job.progress = 100;
            done(null, 'ok');
        }, 3000)
    } else {
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

}

class JobMgr {
    constructor(name) {
        this.name = name;
    }

    async load(crontab) {
        let queue = new MyQueue('crontab');
        await queue.create();
        queue.consume(myJob);

        for (let job of crontab) {
            let { name, enable, immediate, type, interval, cron } = job;
            if (!enable) continue;
            let opts = {};

            if (interval) {
                if (immediate) {
                    queue.addJob(job, opts);
                } else {
                    opts.repeat = { every: interval };
                    setTimeout(async () => {
                        await queue.addJob(job, opts);
                    }, interval);
                }
            } else if (cron) {
                opts.repeat = { cron: cron };
                await queue.addJob(job, opts);
            } else {
                await queue.addJob(job, opts);
            }

        }
    }
}


module.exports = JobMgr;