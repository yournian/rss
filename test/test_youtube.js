const expect = require('chai').expect;
const Youtube = require('../logic/youtube');
const {youtube_key} = require('../config.json');
const {CHANNEL} = require('../consts');
const Youtube = require('../util/youtube');

// let promise = new Youtube().getPlaylist(['snippet'], 'UCghLs6s95LrBWOdlZUCH4qw','');
// promise.then((body) => {
//     console.log(body);
// }).catch((err) => {
//     console.log('err',err);
// })

describe('youtube', () => {
    it('getChannelInfo', async () => {
        let youtube = new Youtube();
        let parts = ['snippet'];
        let id = CHANNEL['stone'].id;
        try{
            let data = await youtube.getChannelInfo(parts, id, youtube_key);
            console.log(data);
            expect(data.items[0].id).to.be.equal(id);
        }catch(err){
            console.log(err);
            expect(true).to.be.equal(false);
        }
    });

    it.only('getImage', async () => {
        let youtube = new Youtube();
        let id = CHANNEL['stone'].id;
        try{
            let image = await youtube.getImage(id);
            console.log(image);
            expect(image.title).to.be.equal('stone记');
        }catch(err){
            console.log(err);
            expect(true).to.be.equal(false);
        }
    });
})

