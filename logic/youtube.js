const File = require('../util/myFile');
const {RssXml} = require('./xml');
const {HtmlDownloader} = require('../util/html');
const logger = require('../util/logger').getLogger();
const {YOUTUBE_KEY} = require('../config');
const request = require('request');

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

class Youtube{
    constructor(){
        this.info = {};
        this.videos = [];
    }

    getUpdate(channel){
        logger.debug('====youtube getUpdate====');
        return this.rssHub(channel);
    }

    async rssHub(channel){
        logger.debug('====youtube rssHub====');
        const prefix = 'https://rsshub.app/youtube/channel/';
        let url = prefix + channel;
        // test 
        // url = 'http://43.255.30.23/feed/rss.xml';
        let htmlBody = await this.readFromUrl(url);
        // let htmlBody = await this.readFromFile('./feed/rsshub.xml');
        await this.parse(htmlBody.content);
    }

    readFromUrl(url){
        logger.debug('====youtube readFromUrl====');
        let htmlDownlaoder = new HtmlDownloader();
        return htmlDownlaoder.download(url);
    }

    readFromFile(fileName){
        logger.debug('====youtube readFromFile====');
        let file = new File();
        return file.read(fileName);
    }

    async parse(htmlBody){
        logger.debug('====youtube parse====');
        try{
            let xml = new RssXml();
            let {info, items} = await xml.parse(htmlBody);
            this.addVideos(items);
        }catch(err){
            console.error(err);
        }
    }

    addVideos(items){
        logger.debug('====youtube addVideos====');
        if(items.length == 0) return;
        for(let item of items){
            this.addVideo(item);
        }
    }

    addVideo(item){
        logger.debug('====youtube addVideo====');
        let {title, guid, audio, pubDate, link, description} = item;
        this.videos.push(new Item(title, guid, audio, pubDate, link, description));
    }

    getChannelInfo(parts, id){
        let part = parts.join(',');
        part = part ? part : 'snippet';
        let key = YOUTUBE_KEY;
        let url = `https://www.googleapis.com/youtube/v3/channels?part=${part}&id=${id}&key=${key}`;
        
        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (error) {
                    logger.error('getChannelInfo failed: ', error);
                    reject(error);
                }else{
                    logger.info('getChannelInfo scuueed');
                    resolve(body);
                }
            })
        })

        // https://www.googleapis.com/youtube/v3/channels?part=snippet&id=UCghLs6s95LrBWOdlZUCH4qw&key=AIzaSyC7AB01-vJWxC6bRVGwj3jLA56hFzWfylY
    }
}

module.exports = Youtube;