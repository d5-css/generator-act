'use strict';


var pkg = require('./package.json');

// uae 配置的 path
fis.config.set('base.path', pkg.name);
// 后端 japid 目录
fis.config.set('backend.japid', 'app/japidsource/japidviews/FrontendController');
// 后端静态资源目录
fis.config.set('backend.static', 'public');
// 后端渲染数据
fis.config.set('backend.data', {
    reg: /\b__BACKEND_DATA__\b/,
    // 后端渲染数据变量名
    server: 'data'
});

// 加载 fis 插件
require('./fis/fis')();
