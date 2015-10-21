'use strict';

var generators = require('yeoman-generator');
var chalk = require('chalk');
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
        this.copy('release.sh', 'release.sh');

        this.directory('fis', 'fis');
        this.directory('i18n', 'i18n');
        this.directory('server', 'server');
    },

    // npm install depedencies
    install: function() {
        if (!this.options['skip-install']) {
            this.log(chalk.cyan('> ') + 'npm install');
            this.npmInstall(null, null, function () {
                this._showTips();
            }.bind(this));
        } else {
            this._showTips();
        }
    },

    // show sub-cmd tips
    // 下划线开头的 key 不会默认执行
    _showTips: function() {
        this.log(
            '\n' +
            chalk.cyan('Tips ') +
            'Use `' + 
            chalk.green('yo act:view <view-name>') +
            '` to create views!\n     Use `' + 
            chalk.green('yo act:cmp new <cmp-name>') +
            '` to create components!'
        );
    }
});