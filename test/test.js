const Youtube = require('../util/youtube');

let promise = new Youtube().getPlaylist(['snippet'], 'UCghLs6s95LrBWOdlZUCH4qw','');
promise.then((body) => {
    console.log(body);
}).catch((err) => {
    console.log('err',err);
})