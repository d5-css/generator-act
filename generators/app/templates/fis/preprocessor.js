'use strict';

var fs = require('fs');
var path = require('path');
var Ejs = require('./ejs');

var PROJECT_DIR = fis.project.getProjectPath();
var I18N = fis.config.get('base.i18n');
var I18N_FILE_PATH = path.join(PROJECT_DIR, 'i18n', I18N + '.json');

var getI18nData = function (file) {
    file.cache.addDeps(I18N_FILE_PATH);
    try {
        return JSON.parse(fs.readFileSync(I18N_FILE_PATH, 'utf8'));
    } catch (e) {
        console.error(e.message);
        return {};
    }
};

/**
 * 将错误信息输出为 html 片段
 * @param  {Error} err 错误信息
 * @return {string}    html 片段
 */
var wrapError = function (err) {
    var html = '<div style="color:red">';
    html += '<h2>' + (err.message || err) + '</h2>';
    if(err.stack){
        html += '<pre>' + err.stack + '</pre>';
    }
    html += '</div>';
    return html;
};

exports.I18N = function (content, file) {
    // 读取 i18n 数据
    var i18nData = getI18nData(file);
    // 渲染 ejs 数据
    try {
        content = (new Ejs({
            text: content
        })).render(i18nData);
    } catch (e) {
        wrapError(e);
    }
    return content;
};
