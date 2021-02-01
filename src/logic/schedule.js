const JobMgr = require('./jobMgr2');
const ctx = require('../context');


async function loadJobs(){
    const models = ctx.models;
    const crontabs = await models.crontabs.findAll({
        where: {enable: 1}
    });
    for(let item of crontabs){
        item.value = item._value;
    }
    let jobMgr = new JobMgr();
    jobMgr.load(crontabs);
}


module.exports = {
    loadJobs
}