const program = require('commander');
const packageJson = require('./package.json');
const logger = require('./util/logger');
const http = require('./http');
const schedule = require('./util/schedule');
const update = require('./logic/updater');
let appConfig = require('./config.json');


program
  .version(packageJson.version, '-v, --vers', 'output the current version')
  .option('-p, --port <type>', 'Listening port number', )
  .option('-d, --domain <domain>', 'Listening host name')
  .option('-l, --loglvl <type>', 'logger level')
  .parse(process.argv);


if (program.port) {
	appConfig.port = program.port;
}

if (program.domain) {
	appConfig.domain = program.domain;
}

if (program.loglvl) {
  logger.level = program.loglvl;
}

global.test = false;

function run(){
    // 即刻运行
    update();
    // 每隔6小时运行一次
    schedule.repeat('01 */6 * * *', update);
    http.listen(appConfig.port);
    logger.info('server listening on [%s]', appConfig.port);
}

process.on('uncaughtException', function (err) {
    logger.error(err.stack);
    logger.error('Caught exception ', err);
});

process.on('unhandledRejection', function (err) {
    logger.error('Caught unhandledRejection ', err);
});


run();


