const MyQueue = require('../util/queue');
const ctx = require('../context');
const logger = ctx.logger;
const {testComsumer, devComsumer, procComsumer} = require('./comsumer');

class JobMgr {
    constructor(name) {
        this.name = name;
    }

    async load(crontab) {
        let queue = new MyQueue('crontab');
        await queue.create();

        if(ctx.isTest()){
            queue.consume(testComsumer);
        }else if(ctx.isDev){
            queue.consume(devComsumer);
        }else if(ctx.isProduction()){
            queue.consume(procComsumer);
        }else{
            logger.warn('no comsumer');
            return;
        }

        for (let job of crontab) {
            let { name, enable, immediate, type, interval, cron } = job;
            if (!enable) continue;
            let opts = {};
            if(ctx.isTest()){
                logger.trace('====test env set interval====', 300000, name);
                interval = 3000;
            }
            if (interval) {
                if (immediate) {
                    logger.info('====immediate====', name, immediate);
                    queue.addJob(job, opts);
                } 
                logger.trace('====job set interval====', name, interval);
                opts.repeat = { every: interval };
                setTimeout(async () => {
                    await queue.addJob(job, opts);
                }, interval);
            } else if (cron) {
                logger.trace('====job set cron====', name, cron);
                opts.repeat = { cron: cron };
                await queue.addJob(job, opts);
            } else {
                await queue.addJob(job, opts);
            }
        }
    }
}


module.exports = JobMgr;