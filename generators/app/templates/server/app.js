'use strict';

var path = require('path');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); // for parsing multipart/form-data
var BASE_DIR = path.join(__dirname, '..');
var PORT = process.env.PORT || 5000;
var app = express();
var pkgFilePath = '../package.json';
var pkg = require(pkgFilePath);
var pkgName = pkg.name;
var EXT_HTML = 'html';


app.use(bodyParser.raw()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
app.use(express.static(BASE_DIR, {}));


function url(path) {
    return '/' + pkgName + path;
}


/*** {{{{{{{{{ 请在这里编写你的业务逻辑









/***  ----END---- }}}}}}}}}*/


/**
 * @Important!!
 * 请保持这段代码在最后的位置，保证页面路由(/:pageName)的优先级不会高过于其它
 */
app.get(url('/:pageName'), function (req, res) {
    var pageName = req.params.pageName;
    var la = req.query.la;
    var fileName = pageName + '_' + (la || 'default') + '.' + EXT_HTML;
    var filePath = path.resolve(BASE_DIR, './' + pkgName, fileName);
    try{
        var stats = fs.lstatSync(filePath);
        if (stats.isFile()) {
            res.sendFile(filePath);
        } else {
            res.status(400).send('404');
        }
    } catch(e) {
        res.status(400).send('404');
    }
});



app.listen(PORT, function() {
    console.log('Express server listening on port %d', PORT);
});