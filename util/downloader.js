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
            let name = item.title + '.m4a';
            let path = Path.media + name;
            let exist = await new File().isExist(path);
            if(!exist){
                promises.push(this.downloadItem(item));
            }else{
                logger.debug('file[%s] exist skip dowmload', item.title);
                let size = new File().getSize(path);
                item.audio.url = name;
                item.audio.size = size ? size : 655555;
                promises.push(new Promise((resolve, reject) => {
                    resolve(item);
                }));
            }
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
            return new Promise((resolve, reject) => {
                let size = new File().getSize(fileName);
                item.audio.url = name + extension;
                item.audio.size = size ? size : 655555;
                resolve(item);
            })
        }else{
            return new Promise((resolve, reject) => {
                // 测试，跳过下载直接写入一个文件
                // new File().save(fileName, 'test').then(() => {
                //     let size = new File().getSize(fileName);
                //     item.audio.url = name + extension;
                //     item.audio.size = size ? size : 655555;
                //     resolve(item);
                // }).catch((err) => {
                //     reject(err);
                // })
                // end 测试

                // todo 优化logger
                let url = item.link;
                const stream = ytdl(url, {filter: 'audioonly'}).pipe(fs.createWriteStream(fileName));
                stream.on('close', () => {
                    console.log('download close');
                })
    
                stream.on('error', (data) => {
                    reject(data);
                    console.error('download failed url: [%s], reason: [%s]', url, data);
                })
    
                stream.on('finish', () => {
                    console.log('download finish');
                    let size = new File().getSize(fileName);
                    item.audio.url = name + extension;
                    item.audio.size = size ? size : 655555;
                    resolve(item);
                })
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