const config = require('./config');
const context = require('./src/context');


async function start(){
    await context.init(config);
    const app = require('./src/app');
    app.start(context);
}

start();