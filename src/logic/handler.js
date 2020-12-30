const File = require('../util/myFile');
const { RssXml, YoutubeXml } = require('./xml');
const { HtmlDownloader } = require('../util/html');
const logger = require('../util/logger');
const {MAX_RETYR_TIMES} = require('../consts');
const {youtube_key} = require('../../config');
const Youtube = require('../util/youtube');
const FeedFactory = require('./feed');
const cheerio = require('cheerio');

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

    readFromUrl(url, encoding) {
        logger.debug('====handler readFromUrl====');
        if(!url) return null;
        let htmlDownlaoder = new HtmlDownloader();
        return htmlDownlaoder.download(url, encoding);
    }

    readFromFile(fileName) {
        logger.debug('====handler readFromFile====');
        return new File().read(fileName);
    }

    async parse(content, type) {
        logger.debug('====handler parse====');
        try {
            let xml;
            if(type == 'ytbFeed'){
                xml = new YoutubeXml();
            }else{
                xml = new RssXml();
            }
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

    transDate(str){
        str = str.replace('th', '');
        return new Date(str).toUTCString();
    }
}

class YoutubeHandler extends Handler{
    constructor(){
        super();
    }

    async updateFeed(config) {
        let {name, value} = config;
        console.log(name, value);
        return;
        let channel = value;
        let url = 'https://www.youtube.com/feeds/videos.xml?channel_id=' + channel;
        // let html = await this.rssHub(channel);
        let html = await this.readFromUrl(url);
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

        let info = await new Youtube().getChannelInfo(['snippet'], id, youtube_key);
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

    async parse(content) {
        return super.parse(content, 'ytbFeed');
    }
}

class RssHandler extends Handler{
    constructor(){
        super();
    }

    async updateFeed(config){
        let {name, value, encoding} = config;
        console.log(name, value);
        return;
        let url = value;
        let html = await this.readFromUrl(url, encoding);
        if(!html){return null};
        let {info, items} = await this.parse(html.content);
        
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

class Rule{
    constructor(){
        this.parentToken = '';
        this.columnToken = '';
        this.infoTokens = {};
    }

    build(rules){
        this.parentToken = rules[0];
        this.columnToken = rules[1];
        this.infoTokens = rules[2];
    }
}

class WebsiteHandler extends Handler{
    constructor(){
        super();
        this.rule = new Rule();
    }

    async updateFeed(config){
        let {name, value, rules, encoding, description} = config;
        // console.log(name, value);
        return;
        let url = value;
        
        // 测试
        // let html = {};
        // html.content = await this.readFromFile('./test/badmintonasia.html');
        
        // 上线 
        let html = await this.readFromUrl(url, encoding);

        if(!html){return null};

        this.rule.build(rules);
        let {info, items} = await this.parse(html.content); //todo
        info.title = name;
        info.link = url;
        info.description = description;

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

    parseElement(rule){
        if(!rule) return null;
        function recursion(arr){
            if (arr.length == 0) return;
            let obj = {};
            let temp = arr[0].split('->');
            if(!temp[0]) return ;
    
            obj.tag = temp[0];
            if (temp[1]) {
                obj.value = temp[1];
            } else {
                obj.child = recursion(arr.slice(1))
            }
            return obj;
        }
    
        let arr = rule.split('|');
        return recursion(arr);
    }

    getEleValue($, source, ele){
        let target = $($(source).find(ele.tag));
        
        while(ele.child){
            let node = target.find(ele.child.tag);
            target = $(node);
            ele = ele.child;
        }
        let value = target.attr(ele.value);

        if(!value && ele.value == 'value'){
            value = target.text();
        }

        return value;

    }

    async parse(content) {
        logger.debug('====handler parse====');
        try {
            var $ = cheerio.load(content);
            let {parentToken, columnToken, infoTokens} = this.rule;
            let parent = $(parentToken)
            let columns = parent.find(columnToken);
            let items = [];
            for(let i = 0; i < columns.length; i++){
                let column = columns[i];
                let item = {};
                for(let token in infoTokens){
                    if(infoTokens[token] == '[object Object]'){
                        item[token] = {};
                        for(let subToken in infoTokens[token]){
                            let ele = this.parseElement(infoTokens[token][subToken]);
                            let value = this.getEleValue($, column, ele);
                            item[token][subToken] = value;
                        }
                    }else{
                        let ele = this.parseElement(infoTokens[token]);
                        if(ele){
                            let value = this.getEleValue($, column, ele);
                            switch(token){
                                case 'pubDate':
                                    value = this.transDate(value);
                                    break;
                                default:
                                    break;
                            }
                            item[token] = value;
                        }else{
                            item[token] = '';
                        }
                    }
                }
                items.push(item);    
            }        
            let info = {};
            return {info, items};
        } catch (err) {
            logger.error('parse html failed: ', err);
            return {};
        }
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
            case 'website':
                handler = new WebsiteHandler();
            default:
                break;
        }
        return handler;
    }
}

module.exports = HandlerFactory