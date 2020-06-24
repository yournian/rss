const Koa = require('koa');
const KoaRouter = require('koa-router');
const path = require('path');
const serve = require('koa-static');
const route = require('./route');

const app = new Koa();
const static = serve(path.join(__dirname, 'static'));

const router = new KoaRouter();
router.get('/feed', route.feed);

app.use(static);
app.use(router.routes()); 


module.exports = app;
