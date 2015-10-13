'use strict';

var generators = require('yeoman-generator');
var changeCase = require('change-case');

module.exports = generators.Base.extend({
    constructor: function () {
        // Calling the super constructor is important so our generator is correctly set up
        generators.Base.apply(this, arguments);

        // This makes `viewName` a required argument.
        this.argument('viewName', { type: String, required: true });
        // And you can then access it later on this way;
        this.viewName = changeCase.paramCase(this.viewName);
    },

    // 创建文件结构
    makeProjectDirectoryStructure: function () {
        // 固定入口文件为 `views/${viewName}/index.${html|js}`
        var viewFilePath = 'views/' + this.viewName;
        this.copy('view.js', viewFilePath + '/index.js');
        this.template('_view.html', viewFilePath + '/index.html');
        // 模拟数据
        this.template('_view.json', viewFilePath + '/mock-data.json');
    }
});
