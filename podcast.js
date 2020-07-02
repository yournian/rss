const logger = require('./util/logger').getLogger();
const http = require('./http');
const {PORT} = require('./config');
const schedule = require('./util/schedule');
const update = require('./logic/updater');


global.test = true;

function run(){
    // 即刻运行
    update();
    // // 每隔6小时运行一次
    // schedule.repeat('01 */6 * * *', update);
    http.listen(PORT);
    logger.info('server listening on [%s]', PORT);
}

process.on('uncaughtException', function (err) {
    logger.error(err.stack);
    logger.error('Caught exception ', err);
});

process.on('unhandledRejection', function (err) {
    logger.error('Caught unhandledRejection ', err);
});


run();


