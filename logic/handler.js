const File = require('../util/myFile');
const { RssXml } = require('./xml');
const { HtmlDownloader } = require('../util/html');
const logger = require('../util/logger').getLogger();
const {MAX_RETYR_TIMES} = require('../consts');
const { YOUTUBE_KEY } = require('../config');
const Youtube = require('../util/youtube');
const FeedFactory = require('./feed');
const iconv = require("iconv-lite");


class Handler{
    constructor(){
        this.retryTimes = 0;
    }

    updateFeed(config){
        logger.info('updateFeed[%s]', config.name);
    }

    reUpdateFeed(config){
        let {name, value} = config;
        logger.debug('====reUpdateFeed[%s] ====', name);
        if(this.retryTimes >= MAX_RETYR_TIMES) return;
        this.retryTimes += 1;
        logger.info('retry update feed[%s] [%d] times', name, this.retryTimes);
        let timeout = this.retryTimes * 10 * 60 * 1000; //n分钟后重试
        let timer = setTimeout(async () => {
            let succeed = await this.updateFeed(name, value);
            if(succeed){
                clearTimeout(timer);
                logger.info('retry update feed[%s] succeed', name);
            };
        }, timeout);
    }

    readFromUrl(url) {
        logger.debug('====handler readFromUrl====');
        if(!url) return null;
        let htmlDownlaoder = new HtmlDownloader();
        return htmlDownlaoder.download(url);
    }

    readFromFile(fileName) {
        logger.debug('====handler readFromFile====');
        return new File().read(fileName);
    }

    async parse(buffer, encoding) {
        logger.debug('====handler parse====');
        if(!encoding) encoding = 'utf-8';

        try {
            let xml = new RssXml();
            let content = iconv.decode(buffer, encoding);
            let { info, items } = await xml.parse(content);
            if (items && items.length == 0) {
                logger.warn('handler parse: no items');
                logger.warn('content: ', content);
            }
            return {info, items};
        } catch (err) {
            logger.error('parse html failed: ', err);
            return {};
        }
    }

    genInfo(name){
        logger.debug('====handler genInfo[%s]====', name);
    }
}

class YoutubeHandler extends Handler{
    constructor(){
        super();
    }

    async updateFeed(config) {
        let {name, value} = config;
        let channel = value;
        let html = await this.rssHub(channel);
        if(!html){return null};
        let {info, items} = await this.parse(html.content);

        if (!items) {
            logger.warn('updateFeed[%s] failed, retry later', name);
            this.reUpdateFeed(config);
            return;
        }

        if (items.length == 0) {
            logger.info('updateFeed[%s], no videos', name);
            return;
        }
    
        let feed = new FeedFactory().getFeed('podcast');
        let exist = await feed.readFromFile(name);
        if (!exist) {
            let href = feed.getHref(name);
            let info = await this.genInfo(name, channel, href);
            feed.generateEmpty(info);
            logger.info('updateFeed[%s], generate empty feed', name);
        }
        // test 暂时最多下载5个
        let updateItems = items.slice(0, 5);
        let toAddItems = this.diff(updateItems, feed.items);
    
        if (toAddItems.length == 0) {
            logger.info('updateFeed[%s], no updates', name);
            return;
        } else {
            logger.info('updateFeed[%s], [%d] updates', name, toAddItems.length);
        }
        
        let youtube = new Youtube();
        let promises = youtube.downloadItems(toAddItems);
        let resultItems = [];
        if(promises.length !== 0){
            resultItems =  await Promise.all(promises);
        }
        feed.addItems(resultItems);
        let succeed = await feed.updateFile(name);
        if (succeed) {
            logger.info('updateFeed[%s] succeed', name);
        } else {
            logger.error('updateFeed[%s] failed', name);
        }
        return succeed;
    }

    async rssHub(channel) {
        logger.debug('====youtube rssHub====');
        const prefix = 'https://rsshub.app/youtube/channel/';
        let url = prefix + channel;
        if (global.test) {
            // test 
            url = `http://localhost:3030/feed/test_youtube.xml`;
        }
        let html = await this.readFromUrl(url);
        return html;
    }

    diff(newer, older) {
        let exist = [];
        older.forEach(element => {
            exist.push(element.title);
        });
    
        let newItems = newer.filter(item => !exist.includes(item.title));
    
        return newItems;
    }

    async genInfo(name, channel, href){
        super.genInfo();
        let image = await this.getImage(channel);
        let info = {
            'title': name,
            'link': 'https://www.youtube.com/channel/' + channel,
            'language': 'zh-cn',
            'description': name + ' 的 Youtube 视频',
            'href': href,
            'pubDate': new Date(),
            'image': image
        }
        return info;
    }

    async getImage(id) {
        if (global.test) {
            return new Promise((resolve, reject) => {
                resolve({
                    'url': 'url',
                    'title': 'title',
                    'link': 'link'
                });
            })
        }

        let image = {
            'url': '',
            'title': '',
            'link': ''
        }

        let info = await new Youtube().getChannelInfo(['snippet'], id, YOUTUBE_KEY);
        if (!info) return image;

        try {
            info = JSON.parse(info);
            let item = info.items[0];
            let image = {
                'url': item.snippet.thumbnails.default.url,
                'title': item.snippet.title,
                'link': 'https://www.youtube.com/channel/' + item.id
            }
            logger.info('youtube getImage succeed');
            return image;
           } catch (err) {
            logger.error('youtube getImage failed: ', err);
            logger.error('info', JSON.stringify(info));
            return null;
        }
    }

    
}

class RssHandler extends Handler{
    constructor(){
        super();
    }

    async updateFeed(config){
        let {name, value, encoding} = config;
        let url = value;
        let html = await this.readFromUrl(url);
        if(!html){return null};
        let {info, items} = await this.parse(html.content, encoding);
        
        if (!items) {
            logger.warn('updateFeed[%s] failed, retry later', name);
            this.reUpdateFeed(config);
            return;
        }

        if (items.length == 0) {
            logger.info('updateFeed[%s], no items', name);
            return;
        }
    
        let feed = new FeedFactory().getFeed('text');
        let exist = await feed.readFromFile(name);
        if (!exist) {
            let href = feed.getHref(name);
            let newInfo = await this.genInfo(name, url, href, info);
            feed.generateEmpty(newInfo);
            logger.info('updateFeed[%s], generate empty feed', name);
        }

        feed.addItems(items);
        let succeed = await feed.updateFile(name);
        if (succeed) {
            logger.info('updateFeed[%s] succeed', name);
        } else {
            logger.error('updateFeed[%s] failed', name);
        }
        return succeed;
    }

    async genInfo(name, url, href, info){
        super.genInfo(name);
        info.href = href;
        info.pubDate = new Date().toUTCString();
        return info;
    }
}

class HandlerFactory{
    constructor(){}

    getHandler(type){
        let handler = null;
        switch(type){
            case 'rss':
                handler = new RssHandler();
                break;
            case 'youtube':
                handler = new YoutubeHandler();
                break;
            default:
                break;
        }
        return handler;
    }
}

module.exports = HandlerFactory