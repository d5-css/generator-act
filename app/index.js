'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var ActGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.npmInstall();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    console.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    console.log(chalk.magenta('You\'re using the fantastic Act generator.'));

    var prompts = [{
      name: 'actName',
      message: 'Would you like to call this activity?'
    }];

    this.prompt(prompts, function (props) {
      this.actName = props.actName;
      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('app');
    this.mkdir('app/templates');

    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
  },

  projectfiles: function () {
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = ActGenerator;
