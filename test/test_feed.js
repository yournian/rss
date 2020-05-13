const expect = require('chai').expect;
const {Feed} = require('../logic/feed');

describe('feed', () => {
    let feed = new Feed();
    it('generateEmpty', async () => {
        let info = {
            'title': 'Title',
            'link': 'google.com',
            'language': 'zh-cn',
            'description': 'Description',
            'href': 'http://43.255.30.23/feed/rss.xml',
            'image': {
                'thumbnail' : 'thumbnail',
                'title' : 'title',
                'link' : 'link'
            }
        };

        feed.generateEmpty(info);
        console.log(feed.info);
        expect(feed.info.title).to.be.equal(info.title);
    });

    it('addItem', async () => {
        let item = {
            'title': 'Podcast Title', 
            'guid': 'http://google.com/', 
            'audio': {
                'url': 'http://example.com/podcast2.m4a',
                'length': '655555',
                'type': 'audio/x-m4a'
            }, 
            'pubDate': 'Wed, 15 Jul 2011 19:00:00 GMT', 
            'link': 'http://example.com/', 
            'description': '描述'
        }

        feed.addItem(item);
        expect(feed.items.length).to.be.equal(1);
        console.log(feed.items);
    })

    // feed.writeFile('podcast.xml');

})
