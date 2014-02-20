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
    //   default: '1.0.0'
    }];

    this.prompt(prompts, function (props) {
      this.actName = props.actName;
      // this.actVersion = props.actVersion;
      done();
    }.bind(this));
  },

  app: function () {
    this.template('_package.json', 'package.json');
  },

  projectfiles: function () {
    this.mkdir('src');
    this.copy('src/jshintrc', 'src/.jshintrc');
    this.template('src/_index.html', 'src/index.html');

    this.mkdir('src/public');
    this.mkdir('src/public/js');
    this.mkdir('src/public/css');
    this.mkdir('src/public/images');
    this.copy('src/public/css/base.css', 'src/public/css/base.css');
  },

  grunt: function () {
    this.mkdir('tasks');
    this.copy('tasks/cmd_compile.js', 'tasks/cmd_compile.js');
    this.copy('tasks/cmd_pack.js', 'tasks/cmd_pack.js');
    this.copy('tasks/lib/cmd.js', 'tasks/lib/cmd.js');
    this.copy('tasks/lib/cssmin.js', 'tasks/lib/cssmin.js');
    this.copy('tasks/lib/lang.js', 'tasks/lib/lang.js');
    this.copy('tasks/lib/util.js', 'tasks/lib/util.js');
    this.copy('Gruntfile.js', 'Gruntfile.js');
  },

  bower: function () {
    // this.template('_bower.json', 'bower.json');
    this.template('bowerrc', '.bowerrc');
    this.bowerInstall(['vue'], { save: true });
  }
});

module.exports = ActGenerator;
