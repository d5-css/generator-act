'use strict';

var express = require('express');
var CONFIG = require('../conf/config.json');

var app = express();

// 开发模式，插入 LIVERELOAD 和 WEINRE
var snippet = '';
if (!process.env.UAE_MODE) {
    var DEV_CONFIG = require('../conf/dev.json');
    var LIVERELOAD_PORT = (DEV_CONFIG.livereload || '').port || 35729;
    var WEINRE_ID = (DEV_CONFIG.weinre || '').id || 'uc_activity';
    var genScript = function (src) {
        return src ? '<script src="' + src + '"><\\/script>' : '';
    };

    if (DEV_CONFIG.livereload.enable || DEV_CONFIG.weinre.enable) {
        snippet = '\n<script>//<![CDATA[\ndocument.write(\'';
        if (DEV_CONFIG.livereload.enable) {
            snippet += genScript('//\' + (location.hostname || \'localhost\') + \':' + LIVERELOAD_PORT + '/livereload.js');
        }
        if (DEV_CONFIG.weinre.enable && WEINRE_ID) {
            snippet += genScript('//weinre.uae.ucweb.local/target/target-script-min.js#' + WEINRE_ID);
        }
        snippet += '\')\n//]]></script>\n';
        app.use(require('connect-inject')({
            snippet: snippet
        }));
    }
}


// 首页为 index.html
function indexHandler(req, res) {
    res.sendFile('public/views/index.html', {
        root: process.cwd()
    });
}
app.get('/', indexHandler);
app.get('/index', indexHandler);

// 静态资源
app.use(express.static(process.cwd()));

// Mock 数据模拟
var MOCKS = require('./mock');
if (!process.env.UAE_MODE && MOCKS.length) {
    var Mock = require('mockjs');
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
var PORT = process.env.PORT || 9000;
server.use(CONFIG.path || '/', app);
server.listen(PORT, function() {
    console.log('Server listening on port ' + PORT);
});
