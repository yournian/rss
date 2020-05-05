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

        // return new Promise((resolve, reject) => {
        //     resolve(true);
        // });

        // return new Promise((resolve, reject) => {
            const stream = ytdl(url).pipe(fs.createWriteStream(fileName));
//             Event: 'close'
// Event: 'drain'
// Event: 'error'
// Event: 'finish'
// Event: 'pipe'
// Event: 'unpipe'
        stream.on('close', (data) => {
            console.log('close', data)
        })

        stream.on('error', (data) => {
            console.log('error', data)
        })

        stream.on('finish', (data) => {
            console.log('finish', data)
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
        // })
    }

    checkExtension(extension){
        return '.m4a'
    }
}

module.exports = {
    YoutubeDownloader,
}