'use strict';

const path = require('path');
const koa = require('koa');
const mount = require('koa-mount');
const regexpRouter = require('koa-regexp-router');

const taskPage = require('./tasks/page.js');
const taskCombo = require('./tasks/combo');

const SRC_PATH = path.join(__dirname, '../pages');

/**
 * Initialize application
 */
let app = koa();

/**
 * page
 */
const REG_PAGE = /^\/([\w\-]+)\/index$/;
app.use(regexpRouter(REG_PAGE, function * (reqPath, pageName) {
    this.body = yield taskPage.render(path.join(SRC_PATH, pageName));
}));

/**
 * js
 */
const REG_PAGE_JS = /^\/([\w\-]+)\/(\w+)\.js$/;
app.use(regexpRouter(REG_PAGE_JS, function * (reqPath, pageName) {
    this.body = yield taskCombo.js(path.join(SRC_PATH, pageName, 'index.js'), true);
}));

/**
 * TODO: css
 */


// 启动服务
let server = koa();
const mountPath = '/test';
const port = 3000;
server.use(mount(mountPath, app));
server.listen(port);
console.log('Running at: http://localhost:%d', port);
