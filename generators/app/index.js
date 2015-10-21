'use strict';

var generators = require('yeoman-generator');
var _ = require('lodash');

module.exports = generators.Base.extend({
    constructor: function() {
        // Calling the super constructor is important so our generator is correctly set up
        generators.Base.apply(this, arguments);
    },

    // 询问 活动名称
    promptActName: function() {
        var done = this.async();
        var defaultName = _.kebabCase(this.appname); // Default to current folder name
        this.prompt({
            type: 'input',
            name: 'actName',
            message: 'Your project name',
            default: defaultName
        }, function(answers) {
            var actName = answers.actName.toLowerCase() === 'y' ? defaultName : answers.actName;
            this.actName = _.kebabCase(actName);
            this.gitName = this.user.git.name();
            this.gitEmail = this.user.git.email();
            done();
        }.bind(this));
    },

    // 创建文件结构
    makeProjectDirectoryStructure: function() {
        this.template('_package.json', 'package.json');
        this.template('_bower.json', 'bower.json');
        this.template('_fis-conf.js', 'fis-conf.js');

        this.copy('jshintrc', '.jshintrc');

        this.directory('fis', 'fis');
        this.directory('i18n', 'i18n');
        this.directory('server', 'server');
    },

    // npm install depedencies
    npmInstallDepedencies: function() {
        var that = this;
        // var done = this.async();
        if (!this.options['skip-install']) {
            this.installDependencies({
                bower: false,
                npm: true,
                callback: function() {
                    that._showTips();
                }
            });
        }

    },

    _showTips: function() {
        this.log('Use `yo act:view <name>` to create new view!');
    }
});