const Queue = require('bull');


class MyQueue {
    constructor(name) {
        this.name = name;
        this.jobs = [];
    }

    async create() {
        let queue = new Queue(this.name);
        await queue.clean(100, 'wait');
        await queue.clean(100, 'completed');
        await queue.clean(100, 'active');
        await queue.clean(100, 'delayed');
        await queue.clean(100, 'failed');
        let jobs = await queue.getRepeatableJobs();
        for(let job of jobs){
            await queue.removeRepeatableByKey(job.key);
            console.log('remove', job.key);
        }

        queue
            .on('active', function (job, jobPromise) {
                // console.log('job id[%s] name[%s], activate', job.id, job.data.name);
                console.log('job name[%s], activate', job.data.name, new Date().getTime()/1000);
            })
            .on('progress', function (job, progress) {
                // console.log('job id[%s] name[%s], progress', job.id, job.data.name, progress);
            })
            .on('completed', function (job, result) {
                // console.log('job id[%s] name[%s], completed', job.id, job.data.name);
                // job.remove();
            })
            .on('failed', function (job, err) {
                // console.log('job id[%s] name[%s], failed', job.id, job.data.name);
            })
            .on('removed', function(job){
                // A job successfully removed.
                // console.log('job id[%s] name[%s], removed', job.id, job.data.name);
              })
            
            .on('paused', function(){
                console.log('he queue has been paused');
            })
            
            .on('resumed', function(){
                console.log('he queue has been resumed');
            })
        this.queue = queue;
        return queue;
    }

    consume(fn, type) {
        if (type) {
            this.queue.process(fn, type);
        } else {
            this.queue.process(fn);
        }
    }

    async addJob(data, type) {
        let job;
        let rand = Math.floor(Math.random() * 100000000);
        let opts = {jobId: rand};
        if (type) {
            job = await this.queue.add(type, data, opts);
        } else {
            job = await this.queue.add(data, opts);
        }
        this.jobs.push(job);
    }

    async getJob(id){
        let job = await this.queue.getJob(id);
        return job;
    }

    async getJobs(){
        let jobs = await this.queue.getJobs();
        return jobs;
    }

    async getJobCount(status) {
        let count = 0;
        switch (status) {
            case 'waiting':
                count = await this.queue.getWaitingCount();
                break;
            case 'completed':
                count = await this.queue.getCompletedCount();
                break;
            case 'dailed':
                count = await this.queue.getFailedCount();
                break;
            case 'delayed':
                count = await this.queue.getDelayedCount();
                break;
            case 'active':
                count = await this.queue.getActiveCount();
                break;
            case 'paused':
                count = await this.queue.getPausedCount();
                break;
            default:
                let obj = await this.queue.getJobCounts();
                for (let key in obj) {
                    count += obj[key];
                }
                break;
        }
        return count;
    }

    async addRepeatJob(data, opts) {
        let rand = Math.floor(Math.random() * 100000000);
        opts.removeOnComplete = true;
        opts.jobId = rand

        let job = await this.queue.add(data, opts);
        this.jobs.push(job);
    }

    async getRepeatableJobs(){
        let jobs = await this.queue.getRepeatableJobs();
        return jobs;
    }

    async removeRepeatableByKey(key){
        await this.queue.removeRepeatableByKey(key);
    }

    async pauseAllJobs(){
        await this.queue.pause();
    }

    async resumeAllJobs(){
        await this.queue.resume();
    }
}

module.exports = MyQueue