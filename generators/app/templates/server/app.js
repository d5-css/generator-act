'use strict';

const koa = require('koa');
const mount = require('koa-mount');
const regexpRouter = require('koa-regexp-router');

const taskView = require('../tasks/view');

/**
 * Initialize application
 */
let app = koa();

/**
 * page
 */
const REG_PAGE = /^\/([\w\-]+)\/index$/;
app.use(regexpRouter(REG_PAGE, function * (reqPath, viewName) {
    this.body = yield taskView.render(viewName);
}));

/**
 * js
 */
const REG_PAGE_JS = /^\/([\w\-]+)\/(\w+)\.js$/;
app.use(regexpRouter(REG_PAGE_JS, function * (reqPath, viewName) {
    this.body = yield taskView.js(viewName);
}));

/**
 * css
 */
const REG_PAGE_CSS = /^\/([\w\-]+)\/(\w+)\.css$/;
app.use(regexpRouter(REG_PAGE_CSS, function * (reqPath, viewName) {
    this.type = 'text/css';
    this.body = yield taskView.css(viewName);
}));


// 启动服务
let server = koa();
const mountPath = '/test';
const port = 3000;
server.use(mount(mountPath, app));
server.listen(port);
console.log('Running at: http://localhost:%d', port);
