const xml2js = require('xml2js');
const { toXML } = require('jstoxml');
const File = require('../util/myFile');
let file = new File();
const logger = require('../context').logger;


class Xml{
    constructor(){
        this.items = [];
    }

    async parseFile(filename){
        logger.debug('====xml parseFile====');
        let data = await file.read(filename);
        return this.parse(data);
    }

    async parse(content){
        logger.debug('====xml parse====');
        let parser = new xml2js.Parser();
        let result;
        try{
            result = await parser.parseStringPromise(content);
        }catch(err){
            console.error(err);
        }
        return this.handle(result);
    }

    async write(content, filename){
        logger.debug('====xml write====');
        try{
             await file.save(filename, content);
             return true;
        }catch(err){
            console.error('write xml failed: [%s]', err);
            return false;
        }
     }

    async writeObj(obj, option, filename){
        logger.debug('====xml writeObj====');
        try{
            let content = toXML(obj, option);
            await file.save(filename, content);
            return true;
        }catch(err){
            console.error('write obj to xml filr failed: [%s]', err);
            return false;
        }
     }
}


class RssXml extends Xml{
    constructor(){
        super();
    }

    handle(result){
        logger.debug('====rssxml handle====');
        try{
            let channel = result.rss.channel[0];
            let info = {
                'title': channel.title ? channel.title[0].trim() : '',
                'link': channel.link ? channel.link[0].trim() : '',
                'description': channel.description ? channel.description[0].trim() : '',
                'href': channel['atom:link'] ? channel['atom:link'][0]['$'].href.trim() : '',
                'pubDate': channel.pubDate ? channel.pubDate[0].trim() : '',
                'image': {}
            }

            if(channel.image && channel.image[0]) {
                let image = channel.image[0];
                info.image = {
                    'link': image.link ? image.link[0] : '',
                    'title': image.title ? image.title[0] : '',
                    'url': image.url ? image.url[0] : '',
                }
            }

            let items = [];
            if(channel.item){
                channel.item.forEach(item => {
                    let newItem = {
                        'title': item.title ? item.title[0].trim() : '',
                        'guid': item.guid ? item.guid[0] : '',
                        'description': item.description ? item.description[0].trim() : '',
                        'pubDate': item.pubDate ? item.pubDate[0].trim() : '',
                        'link': item.link ? item.link[0].trim() : '',
                        'audio': {} 
                    }
                    if(item.enclosure && item.enclosure[0]){
                        newItem.audio = item.enclosure[0]['$'];
                    }
                    items.push(newItem);
                });
            }
            
            return {
                'info': info, 
                'items': items
            }
        }catch(err){
            logger.error(`RssXml handle failed: `, err);
        }
    }
}

class YoutubeXml extends Xml{
    constructor(){
        super();
    }

    handle(result){
        logger.debug('====YoutubeXml handle====');
        try{
            let {author, entry} = result.feed;
            let items = [];
            for(let item of entry){
                let vid = item['yt:videoId'][0];
                let title = item['title'][0];
                let link = item['link'][0]['$']['href'];
                let published = item['published'][0];
                items.push({
                    'title': title ? title.trim() : '',
                    'guid': '',
                    'description': '',
                    'pubDate': published ? published.trim() : '',
                    'link': link ? link.trim() : '',
                    'audio': {} 
                });
            }
            let pubDate = entry[0]['published'][0];
            let info = {
                'title': author[0]['name'],
                'link': author[0]['uri'][0],
                'description': '',
                'href': '',
                'pubDate': pubDate,
                'image': {}
            }
            
            return {
                'info': info, 
                'items': items
            }
        }catch(err){
            logger.error(`YoutubeXml handle failed: `, err);
        }
    }
}


module.exports = {
    RssXml,
    YoutubeXml
};