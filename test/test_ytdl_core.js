const fs = require('fs');
const ytdl = require('ytdl-core');
// TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
// TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
// TypeScript: import ytdl = require('ytdl-core'); with neither of the above

// ytdl(url)
//   .pipe(fs.createWriteStream('test.mp4'));


let url = 'https://www.youtube.com/watch?v=lG7RnOvAN2s';


ytdl.getInfo(url).then(result => {
    console.log(result);
}).catch(err => {
    console.error(err);
})