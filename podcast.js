const schedule = require('./util/schedule');
const Updater = require('./logic/updater');
const {CHANNEL} = require('./consts');

global.test = false;

function update(){
    let updater = new Updater();
    updater.updateFeeds(CHANNEL);
}

update();
// 每隔6小时运行一次
schedule.repeat('01 */6 * * *', update);

