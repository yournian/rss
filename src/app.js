const program = require('commander');
const packageJson = require('../package.json');
const JobMgr = require('./logic/jobMgr2');
const crontab = require('./crontab');
const HandlerFactory = require('./logic/handler');

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

async function myJob(job, done) {
  let data = job.data;
  let handler = new HandlerFactory().getHandler(data.type);
  if(!handler){
      logger.warn('no such handler[%s]', data.type);
      job.progress = 100;
      done('no such handler[%s]', data.type)
  }else{
      handler.updateFeed(data);
      done(null, 'ok')
  } 
}

function start() {
  let jobMgr = new JobMgr('updateFeed');
  jobMgr.process(myJob);
  jobMgr.load(crontab);
  logger.info('rss started');
}

module.exports = {
  start
}