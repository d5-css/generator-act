'use strict';

var generators = require('yeoman-generator');
var changeCase = require('change-case');

module.exports = generators.Base.extend({
    constructor: function () {
        // Calling the super constructor is important so our generator is correctly set up
        generators.Base.apply(this, arguments);

        // This makes `subCommander` a required argument.
        this.argument('subCommander', { type: String, required: true });

        // This makes `componentName` a required argument.
        this.argument('componentName', { type: String, required: true });
        // And you can then access it later on this way;
        this.componentName = changeCase.paramCase(this.componentName);
    },

    // 创建文件结构
    makeProjectDirectoryStructure: function () {
        // 固定入口文件为 `components/${componentName}/index.${html|js|scss}`
        var pageFileName = 'components/' + this.componentName + '/' + this.componentName;
        this.copy('cmp.html', pageFileName + '.html');
        this.copy('cmp.js', pageFileName + '.js');
        this.template('_cmp.scss', pageFileName + '.scss');
    }
});
