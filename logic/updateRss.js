const {Feed} = require('./feed');
const Youtube = require('./youtube');
const {YoutubeDownloader} = require('../util/downloader');
const {DomainName} = require('../consts');
const {Path} = require('../consts');


let channels = [
    {
        'name': 'stone',
        'id': 'UCghLs6s95LrBWOdlZUCH4qw'
    }
];


async function getUpdate(){
    for(let channel of channels){
        let youtube = new Youtube();
        await youtube.getUpdate(channel.id);
        if(youtube.videos.length == 0) return;

        let feed = new Feed();
        let result = await feed.readFromFile(channel.name);
        if(!result){
            let info ={
                'title': channel.name,
                'link': 'https://www.youtube.com/channel/' + channel.id,
                'language': 'zh-cn',
                'description': channel.name + ' 的 Youtube 视频',
                'href': DomainName + 'youtube/feed/' + channel.name + '.xml'
            }
            feed.generateEmpty(info);
        }
        
        let toAddItems = extract(youtube.videos, feed.items);

        if(toAddItems.length == 0) return;
        
        let downloader = new YoutubeDownloader();
        let promises = downloader.downloadItems(toAddItems);
        let items = await Promise.all(promises);
        feed.addItems(items);
        let path = Path.feed + channel.name + '.xml';
        let succeed = await feed.updateFile(path);
        if(succeed){
            console.log('update channel[%s] succeed', channel.name);
        }else{
            console.log('update channel[%s] failed', channel.name);
        }
    }
}


function extract(newer, older){
    let exist = [];
    older.forEach(element => {
        exist.push(element.name);
    });

    let newItems = newer.filter(item => !exist.includes(item.name) );
    return newItems;
}


module.exports = getUpdate