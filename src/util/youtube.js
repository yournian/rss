const fs = require('fs');
const ytdl = require('ytdl-core');
const Str = require('./str');
const File = require('./myFile');
const path = require('path');
const {PATH} = require('../consts');
const request = require('request');
const {md5} = require('./crypto');
const ctx = require('../context');
const isDev = ctx.config.env == 'dev';


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
        // todo 队列
        return this.download(item);
    }

    getAliasName(name){
        return md5(name).slice(0,10);
    }

    download(item){
        console.debug('download itme[%s]', item.title);
        let name  = this.checkName(item.title);
        let alias = this.getAliasName(name);
        let extension = this.checkExtension('.m4a');
        let _path = path.join('static', PATH.media, alias + extension);
        if(new File().isExistSync(_path)){
            console.debug('download escape : already existed file[%s]', name);
            let size = new File().getSize(_path);
            item.audio.url = alias + extension;
            item.audio.length = size ? size : 655555;

            return new Promise((resolve, reject) => {
                resolve(item);
            })
        }else{
            return new Promise((resolve, reject) => {
                if(isDev){
                    // 测试，跳过下载直接写入一个文件
                    new File().save(_path, 'test').then(() => {
                        let size = new File().getSize(_path);
                        item.audio.url = alias + extension;
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
                        item.audio.url = alias + extension;
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

    getPlaylist(parts, id, key){
        let part = parts.join(',');
        part = part ? part : 'snippet';
        let url = `https://youtube.googleapis.com/youtube/v3/playlists?part=${part}&channelId=${id}&maxResults=10&key=${key}`;
        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (error) {
                    console.error('getPlaylist failed: ', error);
                    resolve(null);
                } else {
                    console.info('getPlaylist scuueed');
                    resolve(body);
                }
            })
        })
    }
}

module.exports = Youtube;