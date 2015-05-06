'use strict';

var express = require('express');
var CONFIG = require('../conf/config.json');
var fs = require('fs');

var app = express();

// 开发模式，插入 LIVERELOAD 和 WEINRE
var snippet = '';
if (!process.env.UAE_MODE) {
    var DEV_CONFIG = require('../conf/dev.json') || {};
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

function htmlHandler(html) {
    return function (req, res) {
        res.sendFile('public/views/'+html+'.html', {
            root: process.cwd()
        });
    }
}
//自动读取public/views目录下的html文件，访问路径默认为文件名
fs.readdir('public/views/', function(err, files){
    var fileName;
    for(var i=0; i<files.length; i++){
        fileName = files[i];
        fileName = fileName.substring(0, fileName.lastIndexOf('.html'));
        app.get('/' + fileName, htmlHandler(fileName));
    }
    app.get('/', htmlHandler('index'));
});

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

// 如果是开发模式，在处理完 页面、静态资源 和 Mock 之后再将全部请求丢入 RAP
if (!process.env.UAE_MODE && DEV_CONFIG.rap && DEV_CONFIG.rap.enable) {
    app.use(require('./rap'));
}

// 启动
var server = express();
var PORT = process.env.PORT || 9000;
server.use(CONFIG.path || '/', app);
server.listen(PORT, function() {
    console.log('Server listening on port ' + PORT);
});
