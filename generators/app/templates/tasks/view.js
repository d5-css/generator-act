'use strict';

const fs = require('fs');
const path = require('path');
const combo = require('./combo');

const DEBUG = !!process.env.DEBUG;

const CMP_PATH = path.join(__dirname, '../components');
const VIEW_PATH = path.join(__dirname, '../views');
const TMP_JS_NAME = '.tmp.js';
const TMP_CSS_NAME = '.tmp.scss';

function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch (e) {
        return '';
    }
}

function getViewFile(viewName, fileName) {
    return path.join(VIEW_PATH, viewName, fileName);
}

let renderJs = exports.js = function * (viewName) {
    return yield combo.js(getViewFile(viewName, TMP_JS_NAME));
};

let renderCss = exports.css = function * (viewName) {
    return yield combo.css(getViewFile(viewName, TMP_CSS_NAME));
};

exports.render = function * (viewName) {
    let html = readFile(getViewFile(viewName, 'index.html'));
    // 查找页面中使用到的组件，并替换其内容
    let usedCmps = new Set();
    fs.readdirSync(CMP_PATH).forEach(cmpName => {
        let reg = new RegExp(`<${cmpName}([^>]*)><\/${cmpName}>`, 'i');
        let cmpHtml = '';
        try {
            cmpHtml = readFile(path.join(CMP_PATH, cmpName, cmpName + '.html'));
        } catch (e) {}
        while (reg.test(html)) {
            usedCmps.add(cmpName);
            html = html.replace(
                `<${cmpName}${RegExp.$1}><\/${cmpName}>`,
                `<div class="cmp-${cmpName}"${RegExp.$1}>\n${cmpHtml}\n</div>`
            );
        }
    });
    // 检查全部使用过的组件
    let componentImportList = []; // for css
    let componentRequireList = []; // for js
    let componentList = []; // for js
    usedCmps.forEach(cmpName => {
        componentImportList.push(`@import '../../components/${cmpName}/${cmpName}';`);
        componentRequireList.push(`require('../../components/${cmpName}/${cmpName}');`);
        componentList.push(`'${cmpName}'`);
    });
    // 合并 js
    let mainJsContent = readFile(getViewFile(viewName, 'index.js'));
    mainJsContent = `${componentRequireList.join('\n')}
        [${componentList.join(',')}].forEach(function (cmpName) {
            var elCmps = document.querySelectorAll('.cmp-' + cmpName);
            for (var i = 0; i < elCmps.length; i++) {
                require('../../components/' + cmpName + '/' + cmpName).apply(elCmps[i]);
            }
        });
        ${mainJsContent}`;
    fs.writeFileSync(getViewFile(viewName, TMP_JS_NAME), mainJsContent);
    let comboJsContent = yield renderJs(viewName);
    let comboJsFileName = combo.fileName(comboJsContent, 'js');
    // TODO: if we need ejs
    let serverData = DEBUG ? readFile(getViewFile(viewName, 'mock-data.json')) : '${data}';
    let scripts = `<script>
        window.__data = ${serverData};
        </script>
        <script src="${comboJsFileName}"></script>`;
    html = html.replace('</html>', `${scripts}</html>`);
    // 合并 css
    fs.writeFileSync(getViewFile(viewName, TMP_CSS_NAME), componentImportList.join('\n'));
    let comboCssContent = yield renderCss(viewName);
    let comboCssFileName = combo.fileName(comboCssContent, 'css');
    let styles = `<link rel="stylesheet" href="${comboCssFileName}">`;
    html = html.replace('</head>', `${styles}</head>`);
    return html;
};

