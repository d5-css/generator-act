'use strict';
var yeoman = require('yeoman-generator');

var LangGenerator = yeoman.generators.NamedBase.extend({

    // 创建 lang.json
    jsonFile: function () {
        this.name = (this.name || '').replace(/\s/g, '').toLowerCase();
        if (!this.name) {
            console.log('Please enter language name, e.g, `yo act:lang en`');
            return;
        }
        this.mkdir('languages');
        this.template('lang.json', 'languages/' + this.name + '.json');
    },

    // 向 public/config/grunt.json 写入 lang
    configFile: function () {
        if (!this.name) {
            return;
        }
        var gruntConfigFilePath = 'public/config/grunt.json',
            gruntConfigStr = this.readFileAsString(gruntConfigFilePath),
            gruntConfig;
        try {
            gruntConfig = JSON.parse(gruntConfigStr);
        } catch (e) {
            gruntConfig = {};
        }
        if (!gruntConfig.languages) {
            gruntConfig.languages = {};
        }
        if (!gruntConfig.languages.lang) {
            gruntConfig.languages.lang = [];
        }
        if (gruntConfig.languages.lang.indexOf(this.name) < 0) {
            gruntConfig.languages.lang.push(this.name);
            this.write(gruntConfigFilePath, JSON.stringify(gruntConfig, null, 4));
        }
    }
});

module.exports = LangGenerator;
