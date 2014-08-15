'use strict';

var express = require('express'),
    app = express();

// 自动注入 livereload 和 weinre
var livereloadPort = 35729,
    weinreId = '<%= actName %>',
    genScript = function (src) {
        return src ? '<script src="' + src +'"><\\/script>' : '';
    },
    // snippet = '';
    snippet = '\n<script>//<![CDATA[\ndocument.write(\'' +
        genScript('//\' + (location.hostname || \'localhost\') + \':' + livereloadPort + '/livereload.js') +
        (weinreId ? genScript('//weinre.dev.uae.uc.cn/target/target-script-min.js#' + weinreId) : '') +
        '\')\n//]]></script>\n';

app.use(require('connect-inject')({
    snippet: snippet
}));

// 根目录
var basePath = process.cwd();

app.get('/api/read', function (req, res) {
    setTimeout(function() {
        res.send({});
    }, 1000);
});

// 静态文件目录
// ['/js', '/css', '/images'].forEach(function (path) {
//     app.use(path, express.static(basePath + '/public' + path));
// });

// 首页为 index_dev.html
app.get('/', function (req, res) {
    res.sendfile('./index_dev.html');
});

app.use(express.static(basePath));


var port = process.env.PORT || 4000;
app.listen(port, function() {
    console.log('Server listening on port ' + port);
});
