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
        // this.queues = {};
    }

    async createQueue(name){
        let queue = new Queue(name);
        await queue.clean(100, 'wait');
        await queue.clean(100, 'completed');
        await queue.clean(100, 'active');
        await queue.clean(100, 'delayed');
        await queue.clean(100, 'failed');
        queue
            .on('active', function (job, jobPromise) {
                logger.info('job[%s], activate', job.data.name);
            })
            .on('progress', function (job, progress) {
                logger.info('job[%s], progress[%s]', job.data.name, progress);
            })
            .on('completed', function (job, result) {
                logger.info('job[%s], completed', job.data.name);
            })
            .on('failed', function (job, err) {
                logger.error('job[%s], failed', job.data.name, err);
            })
        return queue;
    }

    async load(crontab) {
        let queue = await this.createQueue('crontab');
        queue.process(myJob);

        for (let job of crontab) {
            let { name, enable, immediate, type, interval, cron } = job;
            if (!enable) continue;
            if(immediate) await queue.add(job)
            setInterval(async () => {
                await queue.add(job)
            }, interval)

            // let model = interval ? { 'every': interval } : { 'cron': cron };
            // let obj = await queue.add(job, { 'delay': 1000, 'repeat': model }); //todo
            // console.log(obj);
        }

        // setInterval(async () => {
        //     let cout = await queue.count();
        //     await queue.clean(2000, 'completed');
        //     let jobs = await queue.getJobs();
        //     let names = jobs.map(ele => ele.data.name).join(',');
        //     console.log('job count', cout, names);
        // }, 2000)
    }

    // async addQueue(name) {
    //     let queue = new Queue(name);

    //     await queue.clean(100, 'wait');
    //     await queue.clean(100, 'completed');
    //     await queue.clean(100, 'active');
    //     await queue.clean(100, 'delayed');
    //     await queue.clean(100, 'failed');

    //     // if(name == 'rss'){
    //     //     let count = await queue.count();
    //     //     let active = await queue.getActiveCount();
    //     //     let waiting = await queue.getWaitingCount();
    //     //     let completedCount = await queue.getCompletedCount();
    //     //     let delayed = await queue.getDelayedCount();

    //     //     console.log(name, count, active, waiting, completedCount,delayed);

    //     //     await queue.clean(100, 'wait');
    //     //     await queue.clean(100, 'active');
    //     //     await queue.clean(100, 'completed');
    //     //     await queue.clean(100, 'delayed');


    //     //     active = await queue.getActiveCount();
    //     //     waiting = await queue.getWaitingCount();
    //     //     count = await queue.count();
    //     //     completedCount = await queue.getCompletedCount();
    //     //     delayed = await queue.getDelayedCount();
    //     //     console.log(name, count, active, waiting, completedCount,delayed);

    //     //     let jobs = await queue.getJobs();
    //     //     if(jobs.length > 0){
    //     //         let state = await jobs[0].getState();
    //     //         console.log(jobss);
    //     //     }
    //     // }
    //     await queue.empty();

    //     queue
    //         .on('active', function (job, jobPromise) {
    //             console.log('job[%s], activate', job.data.name, new Date());
    //         })
    //         .on('progress', function (job, progress) {
    //             console.log('job[%s], progress[%s]', job.data.name, progress);
    //         })
    //         .on('completed', function (job, result) {
    //             console.log('job[%s], completed', job.data.name);
    //         })
    //         .on('failed', function (job, err) {
    //             console.log('job[%s], failed', job.data.name, err);
    //         })
    //     queue.process(myJob);
    //     this.queues[name] = queue;
    // }


    // getQueue(name) {
    //     return this.queues[name];
    // }

    // async load(crontab) {

    //     let qName = new Set(crontab.map(ele => ele.type));
    //     for(let name of qName){
    //         await this.addQueue(name);
    //     }
    //     for (let job of crontab) {
    //         let { name, enable, immediate, type, interval, cron } = job;
    //         if (!enable) continue;
    //         let model = interval ? { 'every': interval } : { 'cron': cron };
    //         let queue = this.getQueue(type);
    //         let obj = await queue.add(name, job, { 'delay': 1000, 'repeat': model }); //todo
    //         // console.log(obj);
    //     }
    // }


    // process() {
    //     for (let queue of this.queues) {
    //         queue.process(myJob);
    //     }
    // }
}


module.exports = JobMgr;