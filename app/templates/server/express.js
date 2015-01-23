'use strict';

var express = require('express');
var Mock = require('mockjs');

var CONFIG = require('../conf/dev.json');
var PATH = CONFIG.path;
var LIVERELOAD_PORT = (CONFIG.livereload || '').port || 35729;
var WEINRE_ID = (CONFIG.weinre || '').id || 'uc_activity';
var PORT = process.env.PORT || 9000;

function genScript(src) {
    return src ? '<script src="' + src + '"><\\/script>' : '';
}

var app = express();

// 插入 LIVERELOAD 和 WEINRE
var snippet = '';
if (!process.env.UAE_MODE && (CONFIG.livereload.enable || CONFIG.weinre.enable)) {
    snippet = '\n<script>//<![CDATA[\ndocument.write(\'';
    if (CONFIG.livereload.enable) {
        snippet += genScript('//\' + (location.hostname || \'localhost\') + \':' + LIVERELOAD_PORT + '/livereload.js');
    }
    if (CONFIG.weinre.enable && WEINRE_ID) {
        snippet += genScript('//weinre.uae.ucweb.local/target/target-script-min.js#' + WEINRE_ID);
    }
    snippet += '\')\n//]]></script>\n';
    app.use(require('connect-inject')({
        snippet: snippet
    }));
}

// 首页为 index.html
function indexHandler(req, res) {
    res.sendfile('public/views/index.html');
}
app.get('/', indexHandler);
app.get('/index', indexHandler);

// 静态资源
app.use(express.static(process.cwd()));

// Mock 数据模拟
var MOCKS = require('./mock');
if (!process.env.UAE_MODE && MOCKS.length) {
    // 遍历 mock 数组
    MOCKS.forEach(function (mockConf) {
        if (mockConf.path) {
            mockConf.method = mockConf.method || 'get';
            // 接入 express
            app[mockConf.method](mockConf.path, function (req, res) {
                // 延迟输出
                setTimeout(function() {
                    res.send(Mock.mock(mockConf.data));
                }, mockConf.delay || 0);
            });
        }
    });
}

// 启动
var server = express();
server.use(PATH, app);
server.listen(PORT, function() {
    console.log('Server listening on port ' + PORT);
});
