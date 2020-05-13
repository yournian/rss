const {RssXml} = require('./xml');
const File = require('../util/myFile');
let file = new File();
const {DomainName, Path} = require('../consts');
const logger = require('../util/logger').getLogger();


class Item{
    constructor(title, guid, audio, pubDate, link, description){
        this.title = title;
        this.guid = guid;
        this.audio = this.setAudio(audio);
        
        this.pubDate = pubDate;
        this.link = link;
        this.description = description;
    }

    setAudio(audio){
        return {
            url: DomainName + 'youtube/media/' + audio.url,
            length: audio.length ? audio.length : 65555,
            type: audio.type ? audio.type : 'audio/x-m4a'
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

}

class Image{
    constructor(){
        this.thumbnail = '';
        this.title = '';
        this.link = '';
    }

    setInfo({thumbnail, title, link}){
        this.thumbnail = thumbnail ? thumbnail : '';
        this.title = title ? title: '';
        this.link = link ? title : '';
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
            'image': new Image()
            // 'items': []
        }
        this.items = [];
    }

    generateEmpty(info){
        logger.debug('====feed generateEmpty====');
        this.setInfo(info);
    }

    setInfo(info){
        let {title, link, href, description, language, image} = info
        logger.debug('====feed setInfo====');
        this.info.title = title ? title : '';
        this.info.link = link ? link : '';
        this.info.href = href ? href : '';
        this.info.description = description ? description : '';
        this.info.language = language ? language : 'zh-cn';
        if(image){
            this.info.image.setInfo(image);
        }
    }

    async readFromFile(name){
        logger.debug('====feed readFromFile====');
        let fileName = Path.feed + name + '.xml'
        let exist = await file.isExist(fileName);
        if(!exist){
            logger.debug('file[%s] no exists', name);
            return false;
        }else{
            logger.debug('file[%s] exists', name);
            let content = await file.read(fileName);
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
        for(let item of items){
            this.addItem(item);
        }
    }

    addItem(item){
        logger.debug('====feed addItem====');
        let {title, guid, audio, pubDate, link, description} = item;
        this.items.push(new Item(title, guid, audio, pubDate, link, description));
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
                    '_name': 'image',
                    '_attrs': {
                        'url': this.info.image.thumbnail,
                        'title': this.info.image.title,
                        'link': this.info.image.link
                    },
                    'content': ''
                },
            ]
        };

        for(let item of this.items){
            content.channel.push({'item': item.format()});
        }
        return content;
    }
}

module.exports = {
    Feed
};