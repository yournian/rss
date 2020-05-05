const {RssXml} = require('./xml');
const File = require('../util/myFile');
let file = new File();


class Item{
    constructor(title, guid, audio, pubDate, link, description){
        this.title = title;
        this.guid = guid;
        this.audio = audio;
        this.pubDate = pubDate;
        this.link = link;
        this.description = description;
    }

    format(){
        let formation = [
            {
                'title': this.title
            },
            {
                _name: 'enclosure',
                _attrs: {
                    url: this.audio.url,
                    length: this.audio.length,
                    type: this.audio.type
                }
            },
            {
                'guid': this.guid
            },
            {
                'pubDate': this.pubDate
            },
            {
                'link': this.link
            },
            {
                'description': this.description
            }
        ]
        return formation;
    }

}

class Feed{
    constructor(){
        this.info = {
            'title': '',
            'link': '',
            'language': '',
            'description': '',
            'href': ''
            // 'items': []
        }
        this.items = [];
    }

    generateEmpty(info){
        this.setInfo(info);
    }

    setInfo(info){
        this.info.title = info.title ? info.title : '';
        this.info.link = info.link ? info.link : '';
        this.info.href = info.href ? info.href : '';
        this.info.description = info.description ? info.description : '';
        this.info.language = info.language ? info.language : 'zh-cn';
    }

    async readFromFile(channel){
        let fileName = __dirname + '/feed/' + channel.name + '.xml'
        let exist = await file.isExist(fileName);
        if(!exist){
            return false;
        }else{
            let content = await file.read(fileName);
            this.rebuild(content);
            return true;
        }
    }

    async rebuild(content){
        let xml = new RssXml();
        let {info, items} = await xml.parse(content);
        this.setInfo(info);
        this.addItems(items);
    }

    getInfo(){
        return this.info;    
    }

    addItems(items){
        if(items.length == 0) return;
        for(let item of items){
            this.addItem(item);
        }
    }

    addItem(item){
        let {title, guid, audio, pubDate, link, description} = item;
        audio = {
            url: 'this.audio.url',
            length: 'this.audio.length',
            type: 'this.audio.type'
        }
        this.items.push(new Item(title, guid, audio, pubDate, link, description));
    }

    writeFile(fileName) {
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
        this.writeFile(fileName);
    }
    
    genContent() {
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
                }
            ]
        };

        for(let item of this.items){
            content.channel.push({'item': item.format()});
        }
        return content;
    }

    update(){

    }
}

class PodcastFeed extends Feed{
    constructor(){
        super();
    }

    update(){

    }
}

module.exports = {
    Feed,
    PodcastFeed
};