const Queue = require('bull');


class JobMgr {
    constructor(name) {
        this.name = name;
        this.queue = this.addQueue(name)
    }

    addQueue(name){
        var queue = new Queue(name);
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
        return queue;
    }

    load(crontab) {
        for (let job of crontab) {
            let { enable, immediate, type, name, interval, cron } = job;
            if (!enable) continue;
            let modal = interval ? { every: interval, limit: 1 } : { cron: cron };
            this.queue.add({name: 'sto', type: 'youtube'}, { repeat: modal });
        } 
    }

    process(fn){
        this.queue.process(fn);
    }
}


module.exports = JobMgr;