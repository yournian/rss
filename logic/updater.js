
const HandlerFactory= require('./handler');
const feeds = require('../data/data.json');
const logger = require('../util/logger');

function update(){
    let factory = new HandlerFactory();
    for(let feed of feeds){
        let handler = factory.getHandler(feed.type);
        if(!handler){
            logger.warn('no such handler[%s]', feed.type);
            return;
        }
        handler.updateFeed(feed);
    }
}

module.exports = update;