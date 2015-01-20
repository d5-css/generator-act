'use strict';

// ajax 的
var METHODS = {
    GET: 'get',
    POST: 'post'
};

/**
 * method: ajax 方法
 * path: ajax 路径
 * delay: 延迟的毫秒数
 * data:，Mock.js，语法参考 http://mockjs.com/#语法规范
 */
module.exports = [{
    method: METHODS.GET,
    path: '/api',
    delay: 200,
    data: {
        success: false,
        msg: 'error message'
    }
}, {
    method: METHODS.POST,
    path: '/api2',
    delay: 20,
    data: {
        success: true,
        time: function () {
            return +new Date();
        },
        'list|1-10': [{
            'id|+1': 1,
            'name': '@FIRST',
            'stars|0-10': '★'
        }]
    }
}];
