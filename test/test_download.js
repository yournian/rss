const {YoutubeDownloader} = require('../util/downloader');

let downloader = new YoutubeDownloader();

async function test(){
    let url = 'https://www.youtube.com/watch?v=lG7RnOvAN2s';
    let name = await downloader.download(url);
    console.log(name);
}
module.exports = test;



