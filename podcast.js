const schedule = require('./util/schedule');
const updateRss = require('./logic/updateRss');

global.test = false;

function update(){
    updateRss();
}

update();
// 每隔6小时运行一次
schedule.repeat('* */6 * * *', update);

