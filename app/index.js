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
      message: 'Would you like to call this activity?',
      default: 'UC Activity'
    }, {
      type: 'confirm',
      name: 'neeUpload',
      message: 'Would you like to upload files in your project?',
      default: false
    }];

    this.prompt(prompts, function (props) {
      this.actName = props.actName;
      this.neeUpload = props.neeUpload;
      done();
    }.bind(this));
  },

  app: function () {
    this.template('_package.json', 'package.json');
  },

  projectfiles: function () {
    this.copy('jshintrc', '.jshintrc');
    this.template('_index.html', 'index.html');

    this.mkdir('public');
    this.mkdir('public/js');
    this.mkdir('public/css');
    this.mkdir('public/images');
    this.copy('public/js/seajs/sea.js', 'public/js/seajs/sea.js');
    this.copy('public/js/core/page.js', 'public/js/core/page.js');
    this.copy('public/js/core/page.js', 'public/js/core/page.js');
    this.copy('public/js/core/net' + (this.neeUpload ? '' : '-lite') + '.js', 'public/js/core/net.js');
    this.copy('public/js/page/index.js', 'public/js/page/index.js');
    this.copy('public/css/base.css', 'public/css/base.css');
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
    this.template('_bower.json', 'bower.json');
    this.template('bowerrc', '.bowerrc');
    // this.bowerInstall(['vue'], { save: true });
  }
});

module.exports = ActGenerator;
