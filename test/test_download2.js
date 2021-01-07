const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require('path');

function download(item){
    let _path = path.join('static', 'media', 'test.m4a');
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
     })
}
let item = {
    'title': 'test',
    'link': 'https://www.youtube.com/watch?v=lG7RnOvAN2s'
  }
download(item);