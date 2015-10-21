'use strict';

var generators = require('yeoman-generator'),
    changeCase = require('change-case'),
    path = require('path'),
    fs = require('fs'),
    slice = Array.prototype.slice,
    toString = Object.prototype.toString,
    templatePath = path.resolve(__dirname, 'templates');

module.exports = generators.Base.extend({
    constructor: function() {
        // Calling the super constructor is important so our generator is correctly set up
        generators.Base.apply(this, arguments);
    },

    // 询问 活动名称
    promptActName: function() {
        var that = this,
            done = this.async();
        var defaultName = changeCase.paramCase(this.appname); // Default to current folder name
        this.prompt({
            type: 'input',
            name: 'actName',
            message: 'Your project name',
            default: defaultName
        }, function(answers) {
            var actName = answers.actName.toLowerCase() === 'y' ? defaultName : answers.actName;
            this.actName = changeCase.paramCase(actName);
            this.gitName = this.user.git.name();
            this.gitEmail = this.user.git.email();
            done();

            that._getTemplate(function(err, template) {
                if (err) return done(err);
                that.sourceRoot(template);
                done();
            });
        }.bind(this));
    },

    // 创建示例组件和页面
    // promptExample: function () {
    //     var done = this.async();
    //     this.prompt({
    //         type: 'input',
    //         name: 'exampleComponent',
    //         message: 'Create example component and view? (y/n)',
    //         default: 'y'
    //     }, function (answers) {
    //         this.exampleComponent = answers.exampleComponent.toLowerCase() === 'y';
    //         done();
    //     }.bind(this));
    // },

    // 创建文件结构
    makeProjectDirectoryStructure: function() {
        this.template('conf/_config.json', 'conf/config.json');
        this.template('_package.json', 'package.json');

        this.copy('jshintrc', '.jshintrc');

        this.directory('fis', 'fis');
        this.directory('i18n', 'i18n');
        this.directory('server', 'server');
    },

    // npm install depedencies
    npmInstallDepedencies: function() {
        var done = this.async();
        if (!this.options['skip-install']) {
            // 执行不通过，先注释了
            // this.npmInstall(done);
        }
    },

    showTips: function() {
        this.log('Use `yo act:view <name>` to create new view!');
    },

    _getTemplate: function(callback) {
        var cacheTemplate = templatePath;
        callback = callback || function() {};

        if (fs.existsSync(cacheTemplate)) {
            return callback.call(this, null, cacheTemplate);
        }
    }
});