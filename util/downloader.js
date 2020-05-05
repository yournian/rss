const fs = require('fs');
const ytdl = require('ytdl-core');
const Str = require('./str');


class Downloader{
    constructor(){

    }

    download(url){
        console.log('download [%s]', url);
    }

    checkName(name){
        if(!name || typeof(str) != 'string'){
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
            let {title, description, pubDate, link} = item;
            // console.log(title[0].trim());
            // console.log(description[0].trim());
            // console.log(pubDate[0].trim());
            // console.log(link[0].trim());

            let url = link.trim();
            let name = title.trim();

            let exist = await file.isExist(name);
            if(!exist){
                promises.add(this.download(url, name, 'mp4'));
            }
        }
        return promises;
    }

    download(url, name, extension){
        super.download(url, name, extension);
        name  = super.checkName(name);
        extension = this.checkExtension(extension);
        let fileName = name + extension;

        return new Promise((resolve, reject) => {
            ytdl(url).pipe(fs.createWriteStream(fileName)).then(() => {
                console.log('download succeed url: [%s]', url);
                let audio = {
                    'title': name, 
                    'size': size
                };
                resolve(audio);
            }).catch(err => {
                console.error('download failed url: [%s], reason: [%s]', url, err);
                reject(err);
            })
        })
    }

    checkExtension(extension){
        return '.mp4'
    }
}

module.exports = {
    YoutubeDownloader,
}