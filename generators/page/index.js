'use strict';

var generators = require('yeoman-generator');
var changeCase = require('change-case');

module.exports = generators.Base.extend({
    constructor: function () {
        // Calling the super constructor is important so our generator is correctly set up
        generators.Base.apply(this, arguments);

        // This makes `pageName` a required argument.
        this.argument('pageName', { type: String, required: true });
        // And you can then access it later on this way; e.g. CamelCased
        this.pageName = changeCase.paramCase(this.pageName);
    },

    // 创建文件结构
    makeProjectDirectoryStructure: function () {
        var pageFileName = 'pages/' + this.pageName + '/' + this.pageName;
        this.template('_page.html', pageFileName + '.html');
        this.copy('page.js', pageFileName + '.js');
        // todo css: less or sass
    }
});
