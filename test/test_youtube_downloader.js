const {YoutubeDownloader} = require('../util/downloader');

async function download(){
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
  let promises = await downloader.downloadItems(items);
  if(promises.length == 0){
    console.log('no downloading');
    return;
  }

  Promise.all(promises).then(posts => {
    for(let name of posts){
        console.log('download [%s] succeed', name);
    }
  }).catch(err => {
      console.error('download failed: ', err);
  })
}

async function test(){
  let result = await download();
  console.log('result:', result);
}

module.exports = test;