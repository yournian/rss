const logger = require('../util/logger').getLogger();
const {Feed} = require('./feed');
const Youtube = require('./youtube');
const {YoutubeDownloader} = require('../util/downloader');
const {CHANNEL, DomainName, Path} = require('../consts');


async function getUpdate(){
    for(let cName in CHANNEL){
        let cID = CHANNEL[cName].id;
        logger.info('update channel[%s]', cName);
        let youtube = new Youtube();
        await youtube.getUpdate(cID);
        if(youtube.videos.length == 0){
            logger.info('update channel[%s], no videos', cName);
            return;
        }

        let feed = new Feed();
        let result = await feed.readFromFile(cName);
        if(!result){
            let image = await youtube.getImage(cID);
            let info ={
                'title': cName,
                'link': 'https://www.youtube.com/channel/' + cID,
                'language': 'zh-cn',
                'description': cName + ' 的 Youtube 视频',
                'href': DomainName + 'youtube/feed/' + cName + '.xml',
                'pubDate': new Date(),
                'image': image
            }
            feed.generateEmpty(info);
            logger.info('update channel[%s], generate empty feed', cName);
        }
        
        let toAddItems = extract(youtube.videos, feed.items);

        if(toAddItems.length == 0){
            logger.info('update channel[%s], no updates', cName);
            return;
        }else{
            logger.info('update channel[%s], [%d] updates', cName, toAddItems.length);
        }
        
        // test 暂时最多下载5个
        toAddItems = toAddItems.slice(0, 5);
        let downloader = new YoutubeDownloader();
        let promises = downloader.downloadItems(toAddItems);
        let items = await Promise.all(promises);
        items = items;
        feed.addItems(items);
        let path = Path.feed + cName + '.xml';
        let succeed = await feed.updateFile(path);
        if(succeed){
            logger.info('update channel[%s] succeed', cName);
        }else{
            logger.error('update channel[%s] failed', cName);
        }
    }
}


function extract(newer, older){
    let exist = [];
    older.forEach(element => {
        exist.push(element.title);
    });

    let newItems = newer.filter(item => !exist.includes(item.title) );

    return newItems;
}


module.exports = getUpdate