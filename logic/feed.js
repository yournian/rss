const {RssXml} = require('./xml');
const File = require('../util/myFile');
const file = new File();
const logger = require('../util/logger').getLogger();
const path = require('path');
const {PATH, MAX_ITEM_LEN} = require('../consts');
const {DOMAIN, PORT} = require('../config');

class Item{
    constructor(title, guid, audio, pubDate, link, description){
        this.title = title;
        this.guid = guid;
        this.audio = audio;
        this.pubDate = pubDate;
        this.link = link;
        this.description = description;
    }

    isLaterThen(item){
        return new Date(this.pubDate) > new Date(item.pubDate);
    }

    format(){
        logger.debug('====feed format====');
        let formation = [
            {
                'title': this.title
            },
            // {
            //     _name: 'guid',
            //     _attrs: {
            //         isPermaLink: false,
            //     },
            //     _content: guid
            // },
            {
                'pubDate': this.pubDate
            },
            {
                'link': this.link
            },
            {
                'description': this.description
            }
            // ,
            // {
            //     'image': this.image.format()
            // }
        ];
        if(this.audio.url){
            formation.push(
                {
                    _name: 'enclosure',
                    _attrs: {
                        url: this.audio.url,
                        length: this.audio.length,
                        type: this.audio.type ? this.audio.type : 'm4a'
                    }
                }
            )
        }
        return formation;
    }

    getMediaPath(name){
        let _path = path.join(PATH.media, name);
        return DOMAIN + ':' + PORT + '/' + _path;
    }

    setMediaPath(name){
        let filename = name + '.m4a';
        let _path = path.join('static', PATH.media, filename);
        if(file.isExistSync(_path)){
            logger.debug('文件已存在[%s]', name);
            this.audio.url = this.getMediaPath(filename);
            this.audio.length = file.getSize(_path);;
        }
    }
}

class Image{
    constructor(){
        this.url = '';
        this.title = '';
        this.link = '';
    }

    setInfo({url, title, link}){
        this.url = url ? url : '';
        this.title = title ? title: '';
        this.link = link ? link : '';
    }

    format(){

    }
}

class Feed{
    constructor(type){
        this.type = type;
        this.info = {
            'title': '',
            'link': '',
            'language': '',
            'description': '',
            'href': '',
            'pubDate': null,
            'image': new Image()
            // 'items': []
        }
        this.items = [];
        this.maxItemNum = MAX_ITEM_LEN;
    }

    generateEmpty(info){
        logger.debug('====feed generateEmpty====');
        this.setInfo(info);
    }

    setInfo(info){
        let {title, link, href, description, language, pubDate, image} = info
        logger.debug('====feed setInfo====');
        this.info.title = title ? title : '';
        this.info.link = link ? link : '';
        this.info.href = href ? href : '';
        this.info.description = description ? description : '';
        this.info.language = language ? language : 'zh-cn';
        this.info.pubDate = pubDate ? pubDate : new Date().toUTCString();
        if(image){
            this.info.image.setInfo(image);
        }
    }

    async readFromFile(name){
        logger.debug('====feed readFromFile====');
        let _path = this.getLocalPath(name);
        
        let exist = await file.isExist(_path);
        if(!exist){
            logger.debug('file[%s] no exists', name);
            return false;
        }else{
            logger.debug('file[%s] exists', name);
            let content = await file.read(_path);
            await this.rebuild(content);
            return true;
        }
    }

    async rebuild(content){
        logger.debug('====feed rebuild====');
        let xml = new RssXml();
        let feed = await xml.parse(content);
        if(!feed){
            logger.warn('rebuild parse no result');
            return;
        }
        this.setInfo(feed.info);
        this.addItems(feed.items);
    }

    getInfo(){
        logger.debug('====feed getInfo====');
        return this.info;    
    }

    addItems(items){
        logger.debug('====feed addItems====');
        if(items.length == 0) return;

        for(let item of items){
            this.addItem(item);
        }
    }

    addItem(item){
        logger.debug('====feed addItem====');
        let {title, guid, audio, pubDate, link, description} = item;
        let _item = new Item(title, guid, audio, pubDate, link, description);

        // todo
        if(audio.url && this.isInvalidAudio(audio)){
            logger.warn('item[%s] invalid audio[%s]', title, JSON.stringify(audio));
            _item.setMediaPath(title);
        }
        this.items.push(_item);
    }

    isInvalidAudio(audio){
        let valid = audio.url && audio.url.includes('.m4a');
        return !valid;
    }

    writeFile(fileName) {
        logger.debug('====feed writeFile====');
        const xmlOptions = {
            header: true,
            indent: '  '
        };
        let obj = {
            _name: 'rss',
            _attrs: {
                'xmlns:atom': 'http://www.w3.org/2005/Atom',
                version: '2.0'
            },
            _content: this.genContent()
        }
        const xml = new RssXml();
        return xml.writeObj(obj, xmlOptions, fileName);
    }

    updateFile(name){
        let path = this.getLocalPath(name);
        logger.debug('====feed updateFile====');
        return this.writeFile(path);
    }
    
    genContent() {
        logger.debug('====feed genContent====');
        let content = {
            'channel': [
                {
                    'title': this.info.title
                },
                {
                    'link': this.info.link
                },
                {
                    '_name': 'atom:link',
                    '_attrs': {
                        'href': this.info.href,
                        'rel': 'self',
                        'type': 'application/rss+xml'
                    },
                    'content': ''
                },
                {
                    'language': this.info.language
                },
                {
                    'description': this.info.description
                },
                {
                    'pubDate': this.info.pubDate
                },
                {
                    'image': {
                        'url': this.info.image.url,
                        'title': this.info.image.title,
                        'link': this.info.image.link
                    }
                }
            ]
        };

        this.sortItems();
        for(let item of this.items.slice(0, MAX_ITEM_LEN)){
            content.channel.push({'item': item.format()});
        }
        return content;
    }

    sortItems(){
        logger.debug('====feed sortItems====');
        this.items.sort((a, b) => b.isLaterThen(a));
    }

    getLocalPath(name){
        return path.join('static', PATH.feed, name + '.xml');
    }

    getHref(name){
        let _path = path.join(PATH.feed, name + '.xml')
        return DOMAIN + '/' + _path; // 无端口
        // return DOMAIN + ':' + PORT + '/' + _path; //有端口
    }
}

module.exports = Feed;