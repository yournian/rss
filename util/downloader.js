const fs = require('fs');
const ytdl = require('ytdl-core');
const Str = require('./str');
const File = require('./myFile');
const {Path} = require('../consts');


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

    downloadItems(items){
        let promises = [];
        for(let item of items){
            // let exist = await new File().isExist(Path.media + item.title);
            // if(!exist){
            promises.push(this.downloadItem(item));
            // }
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
        let fileName = Path.media + name + extension;

        return new Promise((resolve, reject) => {
            const stream = ytdl(url, {filter: 'audioonly'}).pipe(fs.createWriteStream(fileName));
            stream.on('close', () => {
                console.log('download close');
            })

            stream.on('error', (data) => {
                reject(data);
                console.error('download failed url: [%s], reason: [%s]', url, err);
            })

            stream.on('finish', () => {
                console.log('download finish');
                let size = new File().getSize(fileName);
                item.audio.url = name;
                item.audio.size = size ? size : 655555;
                resolve(item);
            })
        })
    }

    getBasicInfo(url){
        return ytdl.getBasicInfo(url, {filter: 'audioonly'})
    }

    checkExtension(extension){
        return '.m4a'
    }
}

module.exports = {
    YoutubeDownloader,
}