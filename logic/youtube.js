const File = require('../util/myFile');
const { RssXml } = require('./xml');
const { HtmlDownloader } = require('../util/html');
const logger = require('../util/logger').getLogger();
const { YOUTUBE_KEY } = require('../config');
const request = require('request');

class Item {
    constructor(title, guid, audio, pubDate, link, description) {
        this.title = title;
        this.guid = guid;
        this.audio = audio;
        this.pubDate = pubDate;
        this.link = link;
        this.description = description;
    }

    format() {
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

class Youtube {
    constructor() {
        this.info = {};
    }

    getUpdate(channel) {
        logger.debug('====youtube getUpdate====');
        return this.rssHub(channel);
    }

    async rssHub(channel) {
        logger.debug('====youtube rssHub====');
        const prefix = 'https://rsshub.app/youtube/channel/';
        let url = prefix + channel;
        if (global.test) {
            // test 
            url = 'http://43.255.30.23/youtube/feed/test.xml';
        }
        let htmlBody = await this.readFromUrl(url);
        if(!htmlBody){return null};
        let items = await this.parse(htmlBody.content);
        return this.handleItems(items);
    }

    readFromUrl(url) {
        logger.debug('====youtube readFromUrl====');
        let htmlDownlaoder = new HtmlDownloader();
        return htmlDownlaoder.download(url);
    }

    readFromFile(fileName) {
        logger.debug('====youtube readFromFile====');
        let file = new File();
        return file.read(fileName);
    }

    async parse(htmlBody) {
        logger.debug('====youtube parse====');
        try {
            let xml = new RssXml();
            let { info, items } = await xml.parse(htmlBody);
            if (items && items.length == 0) {
                logger.warn('youtube handleItems: no video');
                logger.warn('htmlBody: ', htmlBody);
            }
            return items;
        } catch (err) {
            logger.error('youtube parse html failed: ', err);
            return [];
        }
    }

    handleItems(items) {
        logger.debug('====youtube handleItems====');
        let results = [];
        for (let item of items) {
            results.push(this.handleItem(item));
        }
        return results;
    }

    handleItem(item) {
        logger.debug('====youtube handleItem====');
        let { title, guid, audio, pubDate, link, description } = item;
        return new Item(title, guid, audio, pubDate, link, description);
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

        let info = await this.getChannelInfo(['snippet'], id);
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

    getChannelInfo(parts, id) {
        let part = parts.join(',');
        part = part ? part : 'snippet';
        let key = YOUTUBE_KEY;
        let url = `https://www.googleapis.com/youtube/v3/channels?part=${part}&id=${id}&key=${key}`;

        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (error) {
                    logger.error('getChannelInfo failed: ', error);
                    reject(error);
                } else {
                    logger.info('getChannelInfo scuueed');
                    resolve(body);
                }
            })
        })
    }

    // downloadItems(items){
    //     let promises = [];
    //     for(let item of items){
    //         promises.push(this.downloadItem(item));
    //     }
    //     return promises;
    // }

    // downloadItem(item){
    //     return this.download(item);
    // }

    // download(item){
    //     let name  = super.checkName(item.title);
    //     let extension = this.checkExtension('.m4a');
    //     let fileName = Path.media + name + extension;
    //     if(new File().isExistSync(fileName)){
    //         console.log('youtube download escape : already existed file[%s]', name);
    //         return new Promise((resolve, reject) => {
    //             let size = new File().getSize(fileName);
    //             item.audio.url = name + extension;
    //             item.audio.length = size ? size : 655555;
    //             resolve(item);
    //         })
    //     }else{
    //         return new Promise((resolve, reject) => {
    //             if(global.test){
    //                 // 测试，跳过下载直接写入一个文件
    //                 new File().save(fileName, 'content').then(() => {
    //                     let size = new File().getSize(fileName);
    //                     item.audio.url = name + extension;
    //                     item.audio.length = size ? size : 655555;
    //                     resolve(item);
    //                 }).catch((err) => {
    //                     reject(err);
    //                 })
    //             }else{
    //                 // todo 优化logger
    //                 let url = item.link;
    //                 const stream = ytdl(url, {filter: 'audioonly'}).pipe(fs.createWriteStream(fileName));
    //                 stream.on('close', () => {
    //                     console.log('download [%s] close', url);
    //                 })
        
    //                 stream.on('error', (data) => {
    //                     reject(data);
    //                     console.error('download failed url: [%s], reason: [%s]', url, data);
    //                 })
        
    //                 stream.on('finish', () => {
    //                     console.log('download [%s] finish', url);
    //                     let size = new File().getSize(fileName);
    //                     item.audio.url = name + extension;
    //                     item.audio.length = size ? size : 655555;
    //                     resolve(item);
    //                 })
    //             }
    //         })
    //     }
    // }
}

module.exports = Youtube;