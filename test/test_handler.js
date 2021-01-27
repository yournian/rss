const HandlerFactory = require('../src/logic/handler');
let enable = false;
let immediate = false;

let feeds= [
    {
        name: 'stone',
        value: "UCghLs6s95LrBWOdlZUCH4qw",
        type: 'youtube',
        interval: 6*60*60*1000, // 6h
        //   cron: '0 0 * * *',
        enable: enable,
        immediate: immediate
    },
    {
        name: "x3cn_life",
        value: "http://www.x3cn.com/forum.php?mod=rss&fid=67",
        type: "rss",
        encoding: "GBK",
        interval: 3600000, // 1h
        enable: true,
        immediate: true,
    },
    {
        name: "bwfbadminton",
        value: "https://bwfbadminton.com/news/",
        type: "website",
        interval: 21600000, // 6h
        enable: enable,
        immediate: immediate,
        rules: [
            "#newsfeed",
            ".col",
            {
                "link": "a->href",
                "title": "a->title",
                "image": {
                    "link": "a|.thumb|img->src",
                    "title": "a|.thumb|img->alt"
                },
                "pubDate": "a|.entry-meta|.posted-on|time->datetime",
                description: ""
            }
        ],
        description: "bwf badminton news"
    },
]

function start(){
    let jod = feeds[1];
    let handler = new HandlerFactory().getHandler(jod.type);
    handler.updateFeed(jod);
}


module.exports = start;