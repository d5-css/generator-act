'use strict';

var generators = require('yeoman-generator');
var chalk = require('chalk');

module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);
    },

    logVersion: function () {
        var pkg = require('../../package.json');
        this.log(
            chalk.cyan(pkg.name),
            pkg.version
        );
        this.spawnCommand('npm', [
            'list',
            '-g',
            '--depth=0',
            'fis-prepackager-browserify',
            'fis-prepackager-i18n'
        ]);
    }
});
