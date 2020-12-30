const {HtmlDownloader} = require('../util/html');

let url = 'https://www.badmintonasia.org/updates/news';
let filename = 'badmintonasia.html';

async function test(){
    let dowmloader = new HtmlDownloader();
    let html;
    try{
        html = await dowmloader.download(url);
    }catch(err) {
        console.error(err);
    }
    html.save(filename);
}

test();