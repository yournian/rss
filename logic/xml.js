const xml2js = require('xml2js');
const { toXML } = require('jstoxml');
const File = require('../util/myFile');
let file = new File();
const logger = require('../util/logger').getLogger();

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
            // console.log('write obj to xml file succeed');
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
                'title': channel.title[0].trim(),
                'link': channel.link[0].trim(),
                'description': channel.description[0].trim(),
                'href': channel['atom:link'][0]['$'].href.trim(),
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
            channel.item.forEach(item => {
                items.push({
                    'title': item.title[0].trim(),
                    'guid': item.guid ? item.guid[0] : '',
                    'description': '', //item.description[0].trim(),
                    'pubDate': item.pubDate[0].trim(),
                    'link': item.link[0].trim(),
                    'audio': {}
                });
            });

            return {
                'info': info, 
                'items': items
            }
        }catch(err){
            console.log(`RssXml handle failed: `, err);
        }
    }
}


module.exports = {
    RssXml
};