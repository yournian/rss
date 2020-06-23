const {RssXml} = require('./xml');
const File = require('../util/myFile');
const file = new File();
const logger = require('../util/logger').getLogger();
const path = require('path');
const {PATH, DomainName, PORT} = require('../consts');

class Item{
    constructor(title, guid, audio, pubDate, link, description){
        this.title = title;
        this.guid = guid;
        this.audio = this.setAudio(audio);
        
        this.pubDate = pubDate;
        this.link = link;
        this.description = description;
    }

    isLaterThen(item){
        return new Date(this.pubDate) > new Date(item.pubDate);
    }

    setAudio(audio){
        let url = '';
        let length = 0;
        let type = '';
        if(audio){
            url = audio.url ? this.getMediaPath(audio.url) : '',
            length = audio.length ? audio.length : 65555,
            type = audio.type ? audio.type : 'audio/x-m4a'
        }
        return {
            url,
            length,
            type
        } 
    }

    format(){
        logger.debug('====feed format====');
        let formation = [
            {
                'title': this.title
            },
            {
                _name: 'enclosure',
                _attrs: {
                    url: this.audio.url,
                    length: this.audio.length,
                    type: this.audio.type ? this.audio.type : 'audio/x-m4a'
                }
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
        ]
        return formation;
    }

    getMediaPath(name){
        let _path = path.join(PATH.media, name);
        return DomainName + ':' + PORT + '/' + _path;
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
    constructor(){
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
        this.maxItemNum = 20;
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
        this.info.pubDate = pubDate ? pubDate : new Date();
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
        let {info, items} = await xml.parse(content);
        this.setInfo(info);
        this.addItems(items);
    }

    getInfo(){
        logger.debug('====feed getInfo====');
        return this.info;    
    }

    addItems(items){
        logger.debug('====feed addItems====');
        if(items.length == 0) return;
        let len = this.items.length;
        for(let item of items){
            if(len < this.maxItemNum){
                this.addItem(item);
                len++;
            }else{
                logger.debug('====feed addItems reach max====');
                break;
            }
        }
    }

    addItem(item){
        logger.debug('====feed addItem====');
        let {title, guid, audio, pubDate, link, description} = item;
        let _item = new Item(title, guid, audio, pubDate, link, description)
        if(this.isInvalidAudio(audio)){
            logger.warn('item[%s] invalid audio[%s]', title, JSON.stringify(audio));
            _item.setMediaPath(title);
        }
        this.items.push(_item);
    }

    isInvalidAudio(audio){
        if(
            !audio || 
            !audio.url ||
            !audio.url.includes('.m4a')
        ){
            return true;
        }
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

    updateFile(fileName){
        logger.debug('====feed updateFile====');
        this.info.pubDate = new Date();
        return this.writeFile(fileName);
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
        for(let item of this.items){
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
        return DomainName + ':' + PORT + '/' + _path;
    }
}

module.exports = {
    Feed,
    Item
};