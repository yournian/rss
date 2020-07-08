
const HandlerFactory= require('./logic/handler');
const feeds = require('./data/data.json');
const logger = require('./util/logger').getLogger();

function update(){
    let factory = new HandlerFactory();
        let feed = feeds[3]; 
        let handler = factory.getHandler(feed.type);
        if(!handler){
            logger.warn('no such handler[%s]', feed.type);
            return;
        }
        handler.updateFeed(feed);
}

update();