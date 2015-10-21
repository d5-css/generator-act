'use strict';

var deasync = require('deasync');
var browserify = require('browserify');
var stringify = require('stringify');
var debowerify = require('debowerify');

exports.JS = function (content, file) {
    if (file.isLayout && file.isJsLike) {
        var isDone = false;
        // do browserify
        browserify(file.realpath, {
            debug: true
        })
        .transform(stringify(['.tpl', '.html'])) // 支持 require(tpl/html)
        .transform(debowerify) // 支持 bower
        .on('file', function (depFilePath) {
            // find dependences
            if (depFilePath !== file.realpath) {
                file.cache.addDeps(depFilePath);
            }
        })
        .bundle(function (err, buff) {
            if (err) {
                console.error(err.message);
            } else {
                content = buff.toString();
            }
            isDone = true;
        });
        // 使用 deasync 让 browserify 同步输出到 content
        deasync.loopWhile(function (){
            return !isDone;
        });
    }
    return content;
};
