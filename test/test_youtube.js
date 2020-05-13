const expect = require('chai').expect;
const Youtube = require('../logic/youtube');
const {YOUTUBE_KEY} = require('../config');
const {CHANNEL} = require('../consts');

describe('youtube', () => {
    it('getChannelInfo', async () => {
        let youtube = new Youtube();
        let parts = ['snippet'];
        let id = CHANNEL['stone'].id;
        try{
            let data = await youtube.getChannelInfo(parts, id, YOUTUBE_KEY);
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
            expect(image.title).to.be.equal('stone');
        }catch(err){
            console.log(err);
            expect(true).to.be.equal(false);
        }
    });
})

