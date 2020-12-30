const HandlerFactory = require('../logic/handler');
const feeds = require('../data/data.json');

let feed = feeds[5];
let handler = new HandlerFactory().getHandler(feed.type);
handler.updateFeed(feed);