const {Feed} = require('./feed');
const Youtube = require('./youtube');
const {YoutubeDownloader} = require('../util/downloader');

const DomainName = 'http://yournian.info/';
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
                'href': DomainName + 'youtube/feed/' + channel.id + '.xml'
            }
            feed.generateEmpty(info);
        }
        
        let toAddItems = extract(youtube.videos, feed.items); //todo

        if(toAddItems.length == 0) return;

        feed.addItems(toAddItems);
        feed.updateFile('./feed/' + channel.name + '.xml');


        
        return;
        //todo
        let downloader = new YoutubeDownloader();
        let promise = await downloader.downloadItems(toAddItems);
        Promise.all(promise).then(posts => {
            for(let audio of posts){
                let item = {
                    title, 
                    guid, 
                    audio, 
                    pubDate, 
                    link, 
                    description
                };
                feed.addItem(item);
            }
            feed.updateFile(filename);
        }).catch(err => {
            console.error('download failed: ', err);
        })
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