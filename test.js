const config = require('./config.test');
const context = require('./src/context');


async function start(){
    await context.init(config);
    const test = require('./test/test');
    test();
}

start();