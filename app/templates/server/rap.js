'use strict';

var http = require('http');
var Mock = require('mockjs');

var CONFIG = require('../conf/dev.json').rap || {};
var URL_PREFIX = (CONFIG.prefix || 'http://dev6.ucweb.local:15944/mockjs/' ) + CONFIG.projectId;

module.exports = function (req, res, next) {
    // 完整的 URL 则直接跳出 RAP
    if (/^http[s]:\/\//.test(req.url)) {
        next();
        return;
    }
    // 拼接URL 到 rap mock 接口，获取 mock 模板
    http.get(URL_PREFIX + req.url, function (rapResponse) {
        if (200 <= rapResponse.statusCode && rapResponse.statusCode < 300) {
            console.log('[Mock]: ' + req.url);
            rapResponse.on('data', function (chunk) {
                try {
                    console.log(chunk.toString());
                    // 通过 mock 模板模拟数据返回给前端
                    var mockTpl = JSON.parse(chunk);
                    if (mockTpl.isOk === false && mockTpl.errMsg) {
                        // 如果 mock 返回 isOk === false 则跳出 RAP
                        next();
                    } else {
                        // 否则将 mock 返回前端
                        res.send(Mock.mock(mockTpl));
                    }
                } catch (e) {
                    // 出错也跳出 RAP
                    next();
                    console.log(e);
                }
            });
        } else {
            // RAP 数据不可用也跳出
            next();
        }
    }, function () {
        next();
    });
};
