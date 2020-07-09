const logger = require('./util/logger');
const http = require('./http');
const config = require('./config.json');
const schedule = require('./util/schedule');
const update = require('./logic/updater');


global.test = false;

function run(){
    // 即刻运行
    update();
    // // 每隔6小时运行一次
    schedule.repeat('01 */6 * * *', update);
    http.listen(config.port);
    logger.info('server listening on [%s]', config.port);
}

process.on('uncaughtException', function (err) {
    logger.error(err.stack);
    logger.error('Caught exception ', err);
});

process.on('unhandledRejection', function (err) {
    logger.error('Caught unhandledRejection ', err);
});


run();


