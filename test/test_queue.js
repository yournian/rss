const Queue = require('bull');


function myJob(job, done) {
    setTimeout(() => {
        job.progress = 100;
        done(null, 'ok');
    }, 2000)
}

async function createQueue(name){
    let queue = new Queue(name);
    await queue.clean(100, 'wait');
    await queue.clean(100, 'completed');
    await queue.clean(100, 'active');
    await queue.clean(100, 'delayed');
    await queue.clean(100, 'failed');
    queue
        .on('active', function (job, jobPromise) {
            console.log('activate');
            console.info('job[%s], activate', job.data.name);
        })
        .on('progress', function (job, progress) {
            console.info('job[%s], progress[%s]', job.data.name, progress);
        })
        .on('completed', function (job, result) {
            console.log('completed');
            console.info('job[%s], completed', job.data.name);
        })
        .on('failed', function (job, err) {
            console.log('failed');
            console.error('job[%s], failed', job.data.name, err);
        })
    return queue;
}



async function init(){
    let queue = await createQueue('crontab');
    queue.process(myJob);
    return queue;
}

async function main(){
    let queue = await init();
    setInterval(async () => {
        await queue.add({name: 'hhh'})
    }, 2000);
}

module.exports = main;