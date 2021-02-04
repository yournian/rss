const JobMgr = require('./jobMgr2');
const ctx = require('../context');


async function loadJobs(){
    const models = ctx.models;
    const crontabs = await models.crontabs.findAll({
        where: {enable: 1}
    });
    let jobs = [];
    for(let item of crontabs){
        jobs.push({
            name: item.name,
            type: item.type,
            value: item._value,
            interval: item.interval,
            cron: item.cron,
            enable: item.enable,
            immediate: item.immediate,
            encoding: item.encoding,
            description: item.description,
            rule: item.rule,
        });
    }
    let jobMgr = new JobMgr();
    jobMgr.load(jobs);
}


module.exports = {
    loadJobs
}