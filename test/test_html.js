const {HtmlDownloader} = require('../util/html');

let url = 'http://43.255.30.23/feed/rss.xml';
async function test(){
    let dowmloader = new HtmlDownloader();
    let html;
    try{
        html = await dowmloader.download(url);
    }catch(err) {
        console.error(err);
    }
    html.save('rss.xml');
    // console.log(html);
}

test();