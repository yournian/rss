const HandlerFactory = require('../src/logic/handler');
const ctx = require('../src/context');

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
        enable: enable,
        immediate: enable,
    },
    {
        name: "bwfbadminton",
        value: "https://bwfbadminton.com/news/",
        type: "website",
        interval: 21600000, // 6h
        enable: enable,
        immediate: immediate,
        rule: [
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

async function start(){

    const models = ctx.models;
    const crontabs = await models.crontabs.findAll({
        // attributes: ['name',['_value', 'values'], 'type', 'encoding', 'interval', 'enable', 'immediate', 'rule', 'description'],
        where: {enable: 1}
    });
    for(let item of crontabs){
        item.value = item._value;
    }

    let job = crontabs[0];
    console.log(job.value);
    job.immediate = true;
    job.enable = true;
    let handler = new HandlerFactory().getHandler(job.type);
    handler.updateFeed(job);
}


module.exports = start;