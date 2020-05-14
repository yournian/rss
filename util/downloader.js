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
            promises.push(this.downloadItem(item));
        }
        return promises;
    }

    downloadItem(item){
        return this.download(item);
    }

    download(item){
        super.download(item.link, item.title);
        let name  = super.checkName(item.title);
        let extension = this.checkExtension('.m4a');
        let fileName = Path.media + name + extension;
        if(new File().isExistSync(fileName)){
            console.log('download escape : already existed file[%s]', name);
            return new Promise((resolve, reject) => {
                let size = new File().getSize(fileName);
                item.audio.url = name + extension;
                item.audio.size = size ? size : 655555;
                resolve(item);
            })
        }else{
            return new Promise((resolve, reject) => {
                if(global.test){
                    // 测试，跳过下载直接写入一个文件
                    new File().save(fileName, 'test').then(() => {
                        let size = new File().getSize(fileName);
                        item.audio.url = name + extension;
                        item.audio.size = size ? size : 655555;
                        resolve(item);
                    }).catch((err) => {
                        reject(err);
                    })
                }else{
                    // todo 优化logger
                    let url = item.link;
                    const stream = ytdl(url, {filter: 'audioonly'}).pipe(fs.createWriteStream(fileName));
                    stream.on('close', () => {
                        console.log('download [%s] close', url);
                    })
        
                    stream.on('error', (data) => {
                        reject(data);
                        console.error('download failed url: [%s], reason: [%s]', url, data);
                    })
        
                    stream.on('finish', () => {
                        console.log('download [%s] finish', url);
                        let size = new File().getSize(fileName);
                        item.audio.url = name + extension;
                        item.audio.size = size ? size : 655555;
                        resolve(item);
                    })
                }
            })
        }
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