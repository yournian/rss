const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');

const app = new Koa();
const static = serve(path.join(__dirname, 'static'));
app.use(static);


// const KoaRouter = require('koa-router');
// const route = require('./route');
// const router = new KoaRouter();
// router.get('/feed', route.feed);
// app.use(router.routes()); 



module.exports = app;
