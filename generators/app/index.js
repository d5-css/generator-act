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
        this.prompt([{
            type: 'input',
            name: 'actName',
            message: 'Your project name',
            default: defaultName
        }, {
            type: 'input',
            name: 'gitAddress',
            message: 'Your git HOST address',
            default: ''
        }, {
            type: 'confirm',
            name: 'needI18N',
            message: 'Need internationalization (i18n)',
            default: false
        }], function (answers) {
            var actName = answers.actName.toLowerCase() === 'y' ? defaultName : answers.actName;
            this.actName = _.kebabCase(actName);
            this.gitAddress = (answers.gitAddress || '').replace(/^http[s]?:\/\//, '').replace(/\/.*$/, '');
            this.needI18N = !!answers.needI18N;
            this.i18n = this.needI18N ? 'en' : 'i18n';
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

        this.copy('fis/fis.js', 'fis/fis.js');
        this.copy('fis/prepackager.js', 'fis/prepackager.js');
        this.template('fis/_roadmap.path.js', 'fis/roadmap.path.js');

        this.template('i18n/_i18n.json', 'i18n/' + this.i18n + '.json');
        this.directory('server', 'server');
    },

    // it seems we DO NOT need npm install
    // npm install depedencies
    // install: function() {
    //     if (!this.options['skip-install']) {
    //         this.log(chalk.cyan('> ') + 'npm install');
    //         this.npmInstall();
    //     }
    // },

    // show sub-cmd tips when `end`
    end: function() {
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