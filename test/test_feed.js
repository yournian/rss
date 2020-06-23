const expect = require('chai').expect;
const {Feed, Item} = require('../logic/feed');
const {DomainName, PORT} = require('../consts');


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
        feed.writeFile('test.xml');
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

    it('sortItems', async () => {
        let feed = new Feed();
        let item1 = new Item('title', 'guid', {}, 'Tue, 12 May 2020 23:00:01 GMT', 'link', 'description');
        let item2 = new Item('title', 'guid', {}, 'Tue, 12 May 2020 23:00:03 GMT', 'link', 'description');    
        let item3 = new Item('title', 'guid', {}, 'Tue, 12 May 2020 23:00:02 GMT', 'link', 'description');    
        
        feed.addItems([item1, item2, item3]);
        feed.sortItems();
        expect(feed.items[0].pubDate).to.be.equal(item2.pubDate);
    })

    it.only('getLocalPath', () => {
        let feed = new Feed();
        let path = feed.getLocalPath('name');
        expect(path).to.be.equal('static/feed/name.xml');
    })

    it.only('getHref', () => {
        let feed = new Feed();
        let path = feed.getHref('name');
        let url = DomainName + ':' + PORT + '/feed/name.xml';
        expect(path).to.be.equal(url);
    })

})


describe('item', () => {
    let item1 = new Item('title', 'guid', {}, 'Tue, 12 May 2020 23:39:32 GMT', 'link', 'description');
    let item2 = new Item('title', 'guid', {}, 'Tue, 12 May 2020 23:25:43 GMT', 'link', 'description');

    it('isLaterThen', () => {
        expect(item1.isLaterThen(item2)).to.be.equal(true);
    })

    it.only('getMediaPath', () => {
        let item = new Item();
        let path = item.getMediaPath('name.mp3');
        let url = DomainName + ':' + PORT + '/media/name.mp3';
        expect(path).to.be.equal(url);
    })
    

})
