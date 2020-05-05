const fs = require('fs');
const ytdl = require('ytdl-core');
const Str = require('./str');
const File = require('./myFile');

class Downloader{
    constructor(){

    }

    download(url){
        console.log('download [%s]', url);
    }

    checkName(name){
        if(!name || typeof(name) != 'string'){
            name = new Str().randomStr();
        }
        return name;
    }

    checkExtension(extension){
    }
}

class YoutubeDownloader extends Downloader{
    constructor(){
        super();
    }

    async downloadItems(items){
        let promises = [];
        for(let item of items){
            // let {title, guid, audio, pubDate, link, description} = item;
            let exist = await new File().isExist(item.title);
            if(!exist){
                promises.push(this.downloadItem(item));
            }
        }
        return promises;
    }

    downloadItem(item){
        return this.download(item.link, item.title, 'm4a');
    }

    download(url, name, extension){
        super.download(url, name, extension);
        name  = super.checkName(name);
        extension = this.checkExtension(extension);
        let fileName = name + extension;

        return new Promise((resolve, reject) => {
            const stream = ytdl(url, {filter: 'audio'}).pipe(fs.createWriteStream(fileName));
            stream.on('close', () => {
                console.log('download close');
            })

            stream.on('error', (data) => {
                reject(data);
                console.error('download failed url: [%s], reason: [%s]', url, err);

            })

            stream.on('finish', () => {
                console.log('download finish');
                resolve(fileName);
            })

    

            // stream.then((data) => {
            //     console.warn(data);
            //     console.log('download succeed url: [%s]', url);
            //     // let audio = {
            //     //     'title': name, 
            //     //     'size': size
            //     // };
            //     resolve(true);
            // }).catch(err => {
            //     console.error('download failed url: [%s], reason: [%s]', url, err);
            //     reject(err);
            // })
        })
    }

    checkExtension(extension){
        return '.m4a'
    }
}

module.exports = {
    YoutubeDownloader,
}