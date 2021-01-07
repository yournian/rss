const {YoutubeDownloader} = require('../src/util/downloader');


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

async function downloadItems(){
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


async function download(){
  let item = items[0];
  let downloader = new YoutubeDownloader();
  let result = await downloader.download(item.link, item.name);
  console.log('result:', result);
}

async function getBasicInfo(){
  let item = items[0];
  let downloader = new YoutubeDownloader();
  let result = await downloader.getBasicInfo(item.link, item.name);
  console.log('result');
  console.log(result);
}


function test(){
  getBasicInfo();
}


module.exports = test;