'use strict';
var yeoman = require('yeoman-generator');
var bower = require('bower');

var CmpGenerator = yeoman.generators.NamedBase.extend({

  bower: function () {
    var that = this;
    var cmpName;
    if (this.name) {
      console.log('Add component ' + this.name + '...');
      if (this.name === 'vue') {
        cmpName = this.name;
      } else {
        cmpName = 'git@git.ucweb.local:pf/cmp-' + this.name + '.git';
      }

      bower.commands
        .install([cmpName], { save: true }, {})
        .on('end', function (installed) {
          that.spawnCommand('grunt', ['bower']);
        });
      // 不用 this.bowerInstall 是因为没有 callback
      // this.bowerInstall([cmpName], { save: true });
    } else {
      console.log('Usage: yo act:cmp <component-name>');
    }
  }

});

module.exports = CmpGenerator;
