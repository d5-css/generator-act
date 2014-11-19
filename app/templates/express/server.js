'use strict';

var express = require('express'),
    app = express(),
    fs = require('fs'),
    config = JSON.parse(fs.readFileSync('public/config/server.json', {
        encoding: 'utf8'
    })),
    PATH = config.PATH,
    livereloadPort = config.LIVERELOAD_PORT || 35729,
    weinreId = config.WEINRE_ID || 'uc_activity',
    basePath = process.cwd(), // 根目录
    port = config.PORT || 9000,
    genScript = function(src) {
        return src ? '<script src="' + src + '"><\\/script>' : '';
    },
    snippet = '';

if (config.LIVERELOAD || config.WEINRE) {
    snippet = '\n<script>//<![CDATA[\ndocument.write(\'';
    if (config.LIVERELOAD) {
        snippet += genScript('//\' + (location.hostname || \'localhost\') + \':' + livereloadPort + '/livereload.js');
    }
    if (config.WEINRE) {
        snippet += (weinreId ? genScript('//weinre.uae.ucweb.local/target/target-script-min.js#' + weinreId) : '');
    }
    snippet += '\')\n//]]></script>\n';
    app.use(require('connect-inject')({
        snippet: snippet
    }));
}
// 首页为 index_dev.html
app.get(PATH + '/index', function(req, res) {
    res.sendfile('public/views/index_dev.html');
});

// 和后端的路径保持一致
app.use(PATH, express.static(basePath));

app.listen(port, function() {
    console.log('Server listening on port ' + port);
});
