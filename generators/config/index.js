'use strict';

var generators = require('yeoman-generator');
var _ = require('lodash');

module.exports = generators.Base.extend({
    constructor: function () {
        // Calling the super constructor is important so our generator is correctly set up
        generators.Base.apply(this, arguments);

        // This makes `confName` a required argument.
        this.argument('confName', { type: String, required: true });
        // This makes `confValue` a required argument.
        this.argument('confValue', { type: String });

        // And you can then access it later on this way;
        this.confName = _.camelCase(this.confName);
    },

    // 设置配置内容
    setConfigValue: function () {
        // 读取 package.json
        var PACKAGE_JSON_PATH = './package.json';
        try {
            var packageContent = this.fs.readJSON(PACKAGE_JSON_PATH);
            // set val alias
            if (!_.isObject(packageContent.act)) {
                packageContent.act = {};
            }
            packageContent.act[this.confName] = this.confValue;
            // write package.json
            this.fs.writeJSON(PACKAGE_JSON_PATH, packageContent, null, 4);
        } catch (e) {
            this.log(e.message);
        }
    }
});
