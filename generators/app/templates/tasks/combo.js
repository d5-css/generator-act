'use strict';


const browserify = require('browserify');
const sass = require('node-sass');
const hash = require('spark-md5').hash;
const DEBUG = !!process.env.DEBUG;

/**
 * combo js
 * @param {string} src           src file path
 * @yield {string} ouput combo js content
 */
exports.js = function * (src) {
    // 环境
    let uglify;
    let browserifyOpts = { debug: DEBUG };
    if (DEBUG) {
        // 开发环境
        // uglify 啥都不做，假装和 uglify-js 的输出相同
        uglify = code => ({ code: code });
    } else {
        // 生产环境
        uglify = require('uglify-js').minify;
    }

    // 使用 browserify
    return yield cb => browserify(src, browserifyOpts)
        // .transform(stringify(['.tpl', '.html'])) // 支持 require(tpl/html)
        .bundle((err, buf) => {
            if (err) { 
                cb(err);
            } else {
                cb(null, uglify(buf.toString(), {fromString: true}).code);
            }
        });
};


exports.css = function * (src) {
    return yield cb => sass.render({
        file: src,
        sourceMap: DEBUG
    }, (err, res) => {
        if (err) { 
            cb(err);
        } else {
            cb(null, res.css.toString());
        }
    });
};

/**
 * generate hash file name
 * @param  {string} content file content
 * @param  {string} type    file type: `js` or `css`
 * @return {string}         file name with hash
 */
exports.fileName = function (content, type) {
    return hash(content || '').substr(0, 8) + '.' + type;
};
