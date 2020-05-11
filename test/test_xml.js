const {RssXml} = require('../logic/xml');
const { toXML } = require('jstoxml');


async function parseFile(name) {
    const xml = new RssXml();
    await xml.parseFile(name);
    console.log(xml.items.length);
}

function build() {
    let obj = { root: { $: { id: "my id" }, _: "my inner text" } };
    const xml = new RssXml();
    let result = xml.build(obj);
    console.log(result);
}


let testObj = {
    _name: 'rss',
    _attrs: {
        'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
        version: '2.0'
    },
    _content: {
        channel: [
            {
                title: 'Title'
            },
            {
                link: 'google.com'
            },
            {
                language: 'en-us'
            },
            {
                copyright: 'Copyright 2011'
            },
            {
                'itunes:subtitle': 'Subtitle'
            },
            {
                'itunes:author': 'Author'
            },
            {
                'itunes:summary': 'Summary'
            },
            {
                description: 'Description'
            },
            {
                'itunes:owner': {
                    'itunes:name': 'Name',
                    'itunes:email': 'Email'
                }
            },
            {
                _name: 'itunes:image',
                _attrs: {
                    href: 'image.jpg'
                }
            },
            {
                _name: 'itunes:category',
                _attrs: {
                    text: 'Technology'
                },
                _content: {
                    _name: 'itunes:category',
                    _attrs: {
                        text: 'Gadgets'
                    }
                }
            },
            {
                _name: 'itunes:category',
                _attrs: {
                    text: 'TV &amp; Film'
                }
            },
            {
                item: [
                    {
                        title: 'Podcast Title'
                    },
                    {
                        'itunes:author': 'Author'
                    },
                    {
                        'itunes:subtitle': 'Subtitle'
                    },
                    {
                        'itunes:summary': 'Summary'
                    },
                    {
                        'itunes:image': 'image.jpg'
                    },
                    {
                        _name: 'enclosure',
                        _attrs: {
                            url: 'http://example.com/podcast.m4a',
                            length: '8727310',
                            type: 'audio/x-m4a'
                        }
                    },
                    {
                        guid: 'http://example.com/archive/aae20050615.m4a'
                    },
                    {
                        pubDate: 'Wed, 15 Jun 2011 19:00:00 GMT'
                    },
                    {
                        'itunes:duration': '7:04'
                    },
                    {
                        'itunes:keywords': 'salt, pepper, shaker, exciting'
                    }
                ]
            },
            {
                item: [
                    {
                        title: 'Podcast2 Title'
                    },
                    {
                        'itunes:author': 'Author2'
                    },
                    {
                        'itunes:subtitle': 'Subtitle2'
                    },
                    {
                        'itunes:summary': 'Summary2'
                    },
                    {
                        'itunes:image': 'image2.jpg'
                    },
                    {
                        _name: 'enclosure',
                        _attrs: {
                            url: 'http://example.com/podcast2.m4a',
                            length: '655555',
                            type: 'audio/x-m4a'
                        }
                    },
                    {
                        guid: 'http://example.com/archive/aae2.m4a'
                    },
                    {
                        pubDate: 'Wed, 15 Jul 2011 19:00:00 GMT'
                    },
                    {
                        'itunes:duration': '11:20'
                    },
                    {
                        'itunes:keywords': 'foo, bar'
                    }
                ]
            }
        ]
    }
}

function write() {
    const xmlOptions = {
        header: true,
        indent: '  '
    };
    let obj = {
        _name: 'rss',
        _attrs: {
            'xmlns:atom': 'http://www.w3.org/2005/Atom',
            version: '2.0'
        },
        _content: genContent()
    }
    let str = toXML(obj, xmlOptions);
    // console.log(str);
    const xml = new RssXml();
    xml.write(str, 'podcast.xml');
}

function genContent() {
    let content = {
        channel: [
            {
                title: 'Title'
            },
            {
                link: 'google.com'
            },
            {
                _name: 'atom:link',
                _attrs: {
                    'href': 'http://43.255.30.23/feed/rss.xml',
                    'type': 'application/rss+xml'
                },
                content: ''
            },
            {
                language: 'en-us'
            },
            // {
            //     copyright: 'Copyright 2011'
            // },
            {
                description: 'Description'
            },
            {
                item: [
                    {
                        title: 'Podcast2 Title'
                    },
                    {
                        _name: 'enclosure',
                        _attrs: {
                            url: 'http://example.com/podcast2.m4a',
                            length: '655555',
                            type: 'audio/x-m4a'
                        }
                    },
                    {
                        guid: 'http://example.com/archive/aae2.m4a'
                    },
                    {
                        pubDate: 'Wed, 15 Jul 2011 19:00:00 GMT'
                    },
                    {
                        link: 'http://example.com/'
                    },
                    {
                        description: '描述'
                    }
                ]
            },
            {
                item: [
                    {
                        title: 'Podcast2 Title22'
                    },
                    {
                        _name: 'enclosure',
                        _attrs: {
                            url: 'http://example.com/podcast2.m4a',
                            length: '655555',
                            type: 'audio/x-m4a'
                        }
                    },
                    {
                        guid: 'http://example.com/archive/aae2.m4a'
                    },
                    {
                        pubDate: 'Wed, 15 Jul 2011 19:00:00 GMT'
                    },
                    {
                        link: 'http://example.com/'
                    },
                    {
                        description: '描述'
                    }
                ]
            }
        ]
    };
    return content;
}

module.exports = parseFile;