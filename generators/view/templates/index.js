'use strict';

// 后端渲染的数据
var data = window.__data || {};
console.log(data);

// 使用 CommonJS 编写代码
var ex = require('../../components/example/example');
ex();


require('../../components/miao/miao');
