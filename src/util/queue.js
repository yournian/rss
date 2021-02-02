const Queue = require('bull');
const logger = require('../context').logger;


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
        for (let job of jobs) {
            await queue.removeRepeatableByKey(job.key);
        }

        queue
            .on('active', function (job, jobPromise) {
                logger.info('job name[%s], activate', job.data.name);
            })
            .on('progress', function (job, progress) {
                logger.info('job name[%s], progress', job.data.name, progress);
            })
            .on('completed', function (job, result) {
                logger.info('job name[%s], completed', job.data.name);
                // job.remove();
            })
            .on('failed', function (job, err) {
                logger.info('job name[%s], failed', job.data.name);
            })
            .on('removed', function (job) {
                logger.info('job name[%s], removed', job.data.name);
            })
            .on('paused', function () {
                logger.info('the queue has been paused', this.name);
            })
            .on('resumed', function () {
                logger.info('the queue has been resumed', this.name);
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

    async addJob(data, opts = {}) {
        let job = await this.queue.add(data, opts);
        this.jobs.push(job);
    }

    async getJob(id) {
        let job = await this.queue.getJob(id);
        return job;
    }

    async getJobs() {
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

    async getRepeatableJobs() {
        let jobs = await this.queue.getRepeatableJobs();
        return jobs;
    }

    async removeRepeatableByKey(key) {
        await this.queue.removeRepeatableByKey(key);
    }

    async pauseAllJobs() {
        await this.queue.pause();
    }

    async resumeAllJobs() {
        await this.queue.resume();
    }
}

module.exports = MyQueue