const HandlerFactory = require('../src/logic/handler');
const jobs = require('../src/crontab');


function start(){
    let jod = jobs[1];
    let handler = new HandlerFactory().getHandler(jod.type);
    handler.updateFeed(jod);
}


module.exports = start;