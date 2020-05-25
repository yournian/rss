const Koa = require('koa');
const app = new Koa();
const path = require('path');
const serve = require('koa-static');

const static = serve(path.join(__dirname, 'static'));

app.use(static);

module.exports = app;
