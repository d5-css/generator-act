'use strict';

var generators = require('yeoman-generator');
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
                this.bowerInstall(cmpnt, {
                    save: true
                });
                break;
            default:
                this.log(this.help());
        }
    }
});
