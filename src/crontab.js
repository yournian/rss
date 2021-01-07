let enable = true;
let immediate = true;


module.exports = [
    {
        name: 'stone',
        value: "UCghLs6s95LrBWOdlZUCH4qw",
        type: 'youtube',
        interval: 6*60*60*1000, // 6h
        //   cron: '0 0 * * *',
        enable: false,
        immediate: immediate
    },
    {
        name: "x3cn_life",
        value: "http://www.x3cn.com/forum.php?mod=rss&fid=67",
        type: "rss",
        encoding: "GBK",
        interval: 3600000, // 1h
        enable: enable,
        immediate: immediate,
    }, {
        name: "x3cn_estate",
        value: "http://www.x3cn.com/forum.php?mod=rss&fid=111",
        type: "rss",
        encoding: "GBK",
        interval: 3600000, // 1h
        enable: enable,
        immediate: immediate,
    },{
        name: "x3cn_car",
        value: "http://www.x3cn.com/forum.php?mod=rss&fid=1",
        type: "rss",
        encoding: "GBK",
        interval: 3600000, // 1h
        enable: enable,
        immediate: immediate,
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
    {
        name: "badmintonasia",
        value: "https://www.badmintonasia.org/updates/news",
        type: "website",
        interval: 21600000, // 6h
        enable: enable,
        immediate: immediate,
        rules: [
            ".list-news",
            ".items",
            {
                "link": ".wrap|h5|a->href",
                "title": ".wrap|h5|a->value",
                "image": {
                    "link": ".image|a|img->src",
                    "title": ".wrap|h5|a->value"
                },
                "pubDate": ".wrap|.date->value",
                description: ""
            }
        ],
        description: "asia badminton news"
    }
]