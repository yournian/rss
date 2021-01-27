const program = require('commander');
const packageJson = require('../package.json');
const schedule = require('./logic/schedule');
const {logger} = global


process.on('uncaughtException', function (err) {
  logger.error('Caught exception ', err);
  console.log('Caught exception ', err);

});

process.on('unhandledRejection', function (err) {
  logger.error('Caught unhandledRejection ', err);
  console.log('Caught unhandledRejection ', err);
});

program
  .version(packageJson.version, '-v, --vers', 'output the current version')
  .option('-p, --port <type>', 'Listening port number',)
  .option('-d, --domain <domain>', 'Listening host name')
  .option('-l, --loglvl <type>', 'logger level')
  .parse(process.argv);


if (program.port) {
  config.port = program.port;
}

if (program.domain) {
  config.domain = program.domain;
}

if (program.loglvl) {
  logger.level = program.loglvl;
}


function start() {
  try{
    schedule.loadJobs();
    // todo http
    console.log('rss started');
  }catch(err){
    logger.error('rss', err);
  }
}

module.exports = {
  start
}