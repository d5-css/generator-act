'use strict';

const fs = require('fs');
const path = require('path');
const combo = require('./combo');

exports.render = function * (pagePath) {
    let html = fs.readFileSync(path.join(pagePath, 'index.html'), 'utf-8');
    let comboJsContent = yield combo.js(path.join(pagePath, 'index.js'), true);
    let comboJsFileName = combo.fileName(comboJsContent, 'js');
    // TODO: if we need ejs
    html = html.replace('</body>', `<script src="${comboJsFileName}"></script></body>`);
    // TODO: css
    return html;
};
