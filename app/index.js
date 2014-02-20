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
    // }, {
    //   name: 'actVersion',
    //   message: 'What\'s the version of this project?',
    //   default: '1\.0\.0'
    }];

    this.prompt(prompts, function (props) {
      this.actName = props.actName;
      // this.actVersion = props.actVersion;
      done();
    }.bind(this));
  },

  app: function () {
    // this.template('_bower.json', 'bower.json');
    this.template('_package.json', 'package.json');
    this.template('bowerrc', '.bowerrc');
    this.copy('Gruntfile.js', 'Gruntfile.js');
  },

  projectfiles: function () {
    this.template('_index.html', 'index.html');

    this.mkdir('public');
    this.mkdir('public/css');
    this.mkdir('public/js');
    this.copy('public/css/base.css', 'public/css/base.css');
    this.copy('jshintrc', 'public/.jshintrc');
  },

  bower: function () {
    this.bowerInstall(['vue'], { save: true });
  }
});

module.exports = ActGenerator;
