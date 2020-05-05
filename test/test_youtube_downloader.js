const {YoutubeDownloader} = require('../util/downloader');

function download(){
  let items = [
    {
      'title': 'test1',
      'link': 'https://www.youtube.com/watch?v=lG7RnOvAN2s'
    },
    // {
    //   'title': 'test2',
    //   'link': 'https://www.youtube.com/watch?v=lG7RnOvAN2s'
    // }
  ];
  let downloader = new YoutubeDownloader();
  return downloader.downloadItems(items);
}

async function test(){
  let result = await download();
  console.log('result:', result);
}

module.exports = test;