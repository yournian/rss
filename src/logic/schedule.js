const JobMgr = require('./jobMgr2');
const models = global.models;

async function loadJobs(){
    const crontabs = await models.crontabs.findAll({
        attributes: ['name',['_value', 'value'], 'type', 'encoding', 'interval', 'enable', 'immediate'],
        where: {enable: 1}
    });
    let jobMgr = new JobMgr();
    jobMgr.load(crontabs)
}


module.exports = {
    loadJobs
}