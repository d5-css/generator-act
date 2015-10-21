'use strict';

var path = require('path');
var generators = require('yeoman-generator');
var bower = require('bower');
var chalk = require('chalk');
var _ = require('lodash');

module.exports = generators.Base.extend({
    constructor: function () {
        // Calling the super constructor is important so our generator is correctly set up
        generators.Base.apply(this, arguments);

        // This makes `subCommander` a required argument.
        this.argument('subCommander', { type: String, required: true });
        // This makes `componentName` a required argument.
        this.argument('componentName', { type: String, required: true });
    },

    // 创建文件结构
    makeComponent: function () {
        switch (this.subCommander) {
            // 初始化一个组件
            case 'create':
            case 'new':
            case 'n':
                // 固定入口文件为 `components/${componentName}/index.${html|js|less}`
                this.componentName = _.kebabCase(this.componentName);
                var componentPath = 'components/' + this.componentName;
                var componentName = componentPath  + '/' + this.componentName;
                this.copy('cmp.js', componentName + '.js');
                this.template('_cmp.html', componentName + '.html');
                this.template('_cmp.less', componentName + '.less');
                // package.json 方便 require
                this.template('_package.json', componentPath + '/package.json');
                break;
            // 安装一个组件
            case 'install':
            case 'i':
                // 读取 package.json
                var PACKAGE_JSON_PATH = './package.json';
                var packageContent = {};
                try {
                    packageContent = this.fs.readJSON(PACKAGE_JSON_PATH);
                } catch (e) {
                    this.log(e.message);
                }
                var cmpnt = this.componentName;
                // 读取 git 配置
                var gitLocation = (packageContent.act || '').git || '';
                if (cmpnt.indexOf('/') > 0 && gitLocation) {
                    cmpnt = 'git@' + gitLocation + ':' + cmpnt;
                }
                // 通过 bower 下载
                // tips
                this.log(chalk.cyan('installing ') + cmpnt);
                bower.commands
                    .install([cmpnt], { save: true })
                    .on('end', (function (installed) {
                        var destinationRoot = this.destinationRoot();
                        // set browserify alias
                        if (!_.isObject(packageContent.browser)) {
                            packageContent.browser = {};
                        }
                        _.forOwn(installed, function (val, key) {
                            var mainFile = path.join(val.canonicalDir,(val.pkgMeta || '').main || 'index.js');
                            packageContent.browser[key] = './' + path.relative(destinationRoot, mainFile).replace(/\\/g, '/');
                        });
                        // write package.json
                        this.fs.writeJSON(PACKAGE_JSON_PATH, packageContent, null, 4);
                    }).bind(this));
                break;
        }
    }
});
