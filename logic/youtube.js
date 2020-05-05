const File = require('../util/myFile');
const {RssXml} = require('./xml');
const {HtmlDownloader} = require('../util/html');

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
        return this.rssHub(channel);
    }

    async rssHub(channel){
        const prefix = 'https://rsshub.app/youtube/channel/';
        let url = prefix + channel;
        url = 'http://43.255.30.23/feed/rss.xml';
        let htmlBody = await this.readFromUrl(url);
        // let htmlBody = await this.readFromFile('./feed/rsshub.xml');
        await this.parse(htmlBody.content);
    }

    readFromUrl(url){
        let htmlDownlaoder = new HtmlDownloader();
        return htmlDownlaoder.download(url);
    }

    readFromFile(fileName){
        let file = new File();
        return file.read(fileName);
    }

    async parse(htmlBody){
        try{
            let xml = new RssXml();
            let {info, items} = await xml.parse(htmlBody);
            this.addVideos(items);
        }catch(err){
            console.error(err);
        }
    }

    addVideos(items){
        if(items.length == 0) return;
        for(let item of items){
            this.addVideo(item);
        }
    }

    addVideo(item){
        let {title, guid, audio, pubDate, link, description} = item;
        this.videos.push(new Item(title, guid, audio, pubDate, link, description));
    }
}

module.exports = Youtube;