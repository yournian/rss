
const HandlerFactory= require('./handler');
const feeds = require('../../data/data.json');
const crontab = require('../crontab');


function update(){
    let factory = new HandlerFactory();
    let queue = new Queue();
    for(let item of crontab){
        let {name, value, type, interval, enable, immediate} = item;
        if(!enable) continue;
        let handler = factory.getHandler(type);
        if(!handler){
            logger.warn('no such handler[%s]', type);
            continue;
        }
        queue.push(jobs);
        handler.updateFeed(feed);
    }
}

module.exports = update;