'use strict';
var yeoman = require('yeoman-generator');
var bower = require('bower');

var CmpGenerator = yeoman.generators.NamedBase.extend({

  bower: function () {
    var that = this;
    var cmpName;
    if (this.name) {
      console.log('Add component ' + this.name + '...');
      // todo 是否要将 内部和外部 component 拆开
      if (['vue'].indexOf(this.name) >= 0) {
        cmpName = this.name;
        bower.commands
          .install([cmpName], {save: true})
          .on('end', function (installed) {
            // Vue 不是 seajs 模块，需要直接插入到页面中
            that.spawnCommand('grunt', ['bowerInstall']);
            // 将 bower 下载的代码复制到项目中去
            that.spawnCommand('grunt', ['bower']);
          });
      } else {
        cmpName = 'git@git.ucweb.local:pf/cmp-' + this.name + '.git';
        bower.commands
          .install([cmpName])
          .on('end', function (installed) {
            // 将 bower 下载的代码复制到项目中去
            that.spawnCommand('grunt', ['bower']);
          });
      }

      // 不用 this.bowerInstall 是因为没有 callback
      // this.bowerInstall([cmpName], { save: true });
    } else {
      console.log('Usage: yo act:cmp <component-name>');
    }
  }

});

module.exports = CmpGenerator;
