
const logger = require('../util/logger').getLogger();
const { Feed } = require('./feed');
const Youtube = require('./youtube');
const {YoutubeDownloader} = require('../util/downloader');

const MAX_RETYR_TIMES = 5;

class Updater{
    constructor(){
        this.retryTimes = 0;
    }

    async updateFeeds(feeds){
        logger.info('====updateFeeds====');
        for (let name in feeds) {
            let id = feeds[name].id;
            await this.updateFeed(name, id);
        }
    }

    async updateFeed(name, id) {
        logger.info('update feed[%s]', name);
        let youtube = new Youtube();
        let videos = await youtube.getUpdate(id);
        if (!videos) {
            logger.warn('update feed[%s] failed, retry later', name);
            this.reUpdateFeed(name, id);
            return;
        }

        if (videos.length == 0) {
            logger.info('update feed[%s], no videos', name);
            return;
        }
    
        let feed = new Feed();
        let result = await feed.readFromFile(name);
        if (!result) {
            let image = await youtube.getImage(id);
            let info = {
                'title': name,
                'link': 'https://www.youtube.com/channel/' + id,
                'language': 'zh-cn',
                'description': name + ' 的 Youtube 视频',
                'href': feed.getHref(name),
                'pubDate': new Date(),
                'image': image
            }
            feed.generateEmpty(info);
            logger.info('update feed[%s], generate empty feed', name);
        }
        // test 暂时最多下载5个
        let updateItems = videos.slice(0, 5);
        let toAddItems = this.diff(updateItems, feed.items);
    
        if (toAddItems.length == 0) {
            logger.info('update feed[%s], no updates', name);
            return;
        } else {
            logger.info('update feed[%s], [%d] updates', name, toAddItems.length);
        }
        
        let downloader = new YoutubeDownloader(); // todo
        let promises = downloader.downloadItems(toAddItems);
        let items = await Promise.all(promises);
        feed.addItems(items);
        let path = feed.getLocalPath(name);
        let succeed = await feed.updateFile(path);
        if (succeed) {
            logger.info('update feed[%s] succeed', name);
        } else {
            logger.error('update feed[%s] failed', name);
        }
    }
    
    diff(newer, older) {
        let exist = [];
        older.forEach(element => {
            exist.push(element.title);
        });
    
        let newItems = newer.filter(item => !exist.includes(item.title));
    
        return newItems;
    }
    
    reUpdateFeed(name, id){
        if(this.retryTimes >= MAX_RETYR_TIMES) return;
        this.retryTimes += 1;
        logger.info('retry update feed[%s] [%d] times', name, this.retryTimes);
        let timeout = this.retryTimes * 1000;
        setTimeout(() => {
            this.updateFeed(name, id);
        }, timeout);
    }
}

module.exports = Updater;