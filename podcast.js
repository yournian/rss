const http = require('./http');
const schedule = require('./util/schedule');
const Updater = require('./logic/updater');
const {CHANNEL, PORT} = require('./consts');

global.test = false;

function run(){
    // 即刻运行
    update();
    // 每隔6小时运行一次
    schedule.repeat('01 */6 * * *', update);
    http.listen(PORT);
}

function update(){
    let updater = new Updater();
    updater.updateFeeds(CHANNEL);
}

run();
