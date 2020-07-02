const fs = require('fs');
const ytdl = require('ytdl-core');
const Str = require('./str');
const File = require('./myFile');
const path = require('path');
const {PATH} = require('../consts');
const request = require('request');


class Youtube{
    constructor(){
    }

    checkName(name){
        if(!name || typeof(name) != 'string'){
            name = new Str().randomStr();
        }
        return name;
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
        console.debug('download itme[%s]', item.title);
        let name  = this.checkName(item.title);
        let extension = this.checkExtension('.m4a');
        let _path = path.join('static', PATH.media, name + extension);
        if(new File().isExistSync(_path)){
            console.debug('download escape : already existed file[%s]', name);
            let size = new File().getSize(_path);
            item.audio.url = name + extension;
            item.audio.length = size ? size : 655555;

            return new Promise((resolve, reject) => {
                resolve(item);
            })
        }else{
            return new Promise((resolve, reject) => {
                if(global.test){
                    // 测试，跳过下载直接写入一个文件
                    new File().save(_path, 'test').then(() => {
                        let size = new File().getSize(_path);
                        item.audio.url = name + extension;
                        item.audio.length = size ? size : 655555;
                        resolve(item);
                    }).catch((err) => {
                        reject(err);
                    })
                }else{
                    let url = item.link;
                    const stream = ytdl(url, {filter: 'audioonly'}).pipe(fs.createWriteStream(_path));
                    stream.on('close', () => {
                        console.log('download [%s] close', url);
                    })
        
                    stream.on('error', (data) => {
                        reject(data);
                        console.error('download failed url: [%s], reason: [%s]', url, data);
                    })
        
                    stream.on('finish', () => {
                        console.log('download [%s] finish', url);
                        let size = new File().getSize(_path);
                        item.audio.url = name + extension;
                        item.audio.length = size ? size : 655555;
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

    getChannelInfo(parts, id, key) {
        let part = parts.join(',');
        part = part ? part : 'snippet';
        let url = `https://www.googleapis.com/youtube/v3/channels?part=${part}&id=${id}&key=${key}`;

        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (error) {
                    console.error('getChannelInfo failed: ', error);
                    resolve(null);
                } else {
                    console.info('getChannelInfo scuueed');
                    resolve(body);
                }
            })
        })
    }
}

module.exports = Youtube;