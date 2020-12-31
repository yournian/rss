const Queue = require('bull');
const HandlerFactory = require('./handler');

async function myJob(job, done) {
    let data = job.data;
    let handler = new HandlerFactory().getHandler(data.type);
    if (!handler) {
        logger.warn('no such handler[%s]', data.type);
        job.progress = 100;
        done('no such handler[%s]', data.type)
    } else {
        await handler.updateFeed(data);
        done(null, 'ok')
    }
}

class JobMgr {
    constructor(name) {
        this.name = name;
        this.queues = {};
    }

    async addQueue(name) {
        let queue = new Queue(name);
        await queue.empty();
        queue
            .on('active', function (job, jobPromise) {
                console.log('job[%s], activate', job.data.name, new Date());
            })
            .on('progress', function (job, progress) {
                console.log('job[%s], progress[%s]', job.data.name, progress);
            })
            .on('completed', function (job, result) {
                console.log('job[%s], completed', job.data.name);
            })
            .on('failed', function (job, err) {
                console.log('job[%s], failed', job.data.name);
            })
        queue.process(myJob);
        this.queues[name] = queue;
    }

    getQueue(name) {
        return this.queues[name];
    }

    async load(crontab) {
        let qName = new Set(crontab.map(ele => ele.type));
        for(let name of qName){
            await this.addQueue(name);
        }
        for (let job of crontab) {
            let { enable, immediate, type, interval, cron } = job;
            if (!enable) continue;
            let model = interval ? { 'every': interval } : { 'cron': cron };
            let queue = this.getQueue(type);
            queue.add(job, { 'repeat': model, 'delay': 10*1000 }); //todo
        }
    }

    process() {
        for (let queue of this.queues) {
            queue.process(myJob);
        }
    }
}


module.exports = JobMgr;