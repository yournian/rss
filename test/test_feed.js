const Feed = require('../logic/feed');

let feed = new Feed();
let info = {
    'title': 'Title',
    'link': 'google.com',
    'language': 'zh-cn',
    'description': 'Description',
    'href': 'http://43.255.30.23/feed/rss.xml'
};
feed.setInfo(info);

let items = {
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

feed.addItem(items);
feed.writeFile('podcast.xml');