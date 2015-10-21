'use strict';


var I18N = process.env.I18N || 'en';

// uae 配置的 path
fis.config.set('base.path', '<%= actName %>');
// 当前要构建的语言
fis.config.set('base.i18n', I18N);
// 后端 japid 目录
fis.config.set('backend.japid', 'app/japidviews/FrontendController');
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
