'use strict';

var path = require('path');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');

var BASE_DIR = path.join(__dirname, '..');
var PKG_FILE_PATH = '../package.json';
var PKG_NAME = require(PKG_FILE_PATH).name;
var DEFAULT_I18N = 'default';
var EXT_HTML = 'html';

var app = express();
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

app.use(express.static(BASE_DIR, {}));

/**
 * 给 url 添加 path
 * @param  {string} path url
 * @return {string}      完整的 url
 */
function urlPath(path) {
    var SLASH = '/';
    path = path || '';
    if (path[0] !== SLASH) {
        path = SLASH + path;
    }
    return SLASH + PKG_NAME + path;
}

function generate404(tips) {
    return [
        '<html><body>',
            '<h1>404</h1>',
            '<p>',
                tips,
            '</p>',
        '</body></html>'
    ].join('');
}

/*** {{{{{{{{{ 请在这里编写你的业务逻辑 */

/**
 * 上传文件示例
 * 使用 https://github.com/expressjs/multer
var upload = require('multer')(); // for parsing multipart/form-data
app.post(
    urlPath('/upload'),
    upload.single('filekey'), // filekey 为上传文件的参数名
    function (req, res) {
        console.log(req.file);
        res.send({
            success: true
        });
    }
);
*/







/***  ----END---- }}}}}}}}} */


/**
 * @Important!!
 * 请保持这段代码在最后的位置，保证页面路由(/:pageName)的优先级不会高过于其它
 */
app.get(urlPath('/:pageName'), function (req, res) {
    var pageName = req.params.pageName;
    var la = req.query.la;
    var fileName = pageName + '_' + (la || DEFAULT_I18N) + '.' + EXT_HTML;
    var filePath = path.resolve(BASE_DIR, './' + PKG_NAME, fileName);
    function tips404 () {
        return [
            'page `',
            pageName,
            '` with i18n `',
            la,
            '` NOT found!'
        ].join('');
    }
    try {
        var stats = fs.lstatSync(filePath);
        if (stats.isFile()) {
            res.sendFile(filePath);
        } else {
            res.status(400).send(generate404(tips404()));
        }
    } catch(e) {
        res.status(400).send(generate404(tips404()));
    }
});


var PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
    console.log('Server start! http://127.0.0.1:%d/%s/<view-name>', PORT, PKG_NAME);
});
