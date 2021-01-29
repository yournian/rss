const JobMgr = require('./jobMgr2');
const ctx = require('../context');


async function loadJobs(){
    const models = ctx.models;
    const crontabs = await models.crontabs.findAll({
        attributes: ['name',['_value', 'value'], 'type', 'encoding', 'interval', 'enable', 'immediate', 'rule', 'description'],
        where: {enable: 1}
    });
    let jobMgr = new JobMgr();
    jobMgr.load(crontabs);
}


module.exports = {
    loadJobs
}