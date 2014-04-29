'use strict';
var yeoman = require('yeoman-generator');
var bower = require('bower');

var CmpGenerator = yeoman.generators.NamedBase.extend({

  askFor: function () {
    var done = this.async();
    this.name = (this.name || '').replace(/^cmp\-/, '').replace(/\s/g, '');

    // 如果有名字猜可以继续
    if (this.name) {
      var prompts = [{
        name: 'ver',
        message: 'What version would you take for cmp-' + this.name + '?',
        default: '*'
      }];
      this.prompt(prompts, function (props) {
        this.ver = props.ver;
        done();
      }.bind(this));
    } else {
      // 否则给个提示
      console.log('Please enter component name, e.g, `yo act:cmp list`');
    }
  },

  bower: function () {
    var that = this;
    var cmpName;
    console.log('Add component ' + this.name + '...');
    // todo 是否要将 内部和外部 component 拆开
    if (['vue'].indexOf(this.name) >= 0) {
      cmpName = this.name;
      if (this.ver !== '*') {
        cmpName += '#' + this.ver;
      }
      bower.commands
        .install([cmpName])
        .on('end', function (installed) {
          // bowerInstall: Vue 不是 seajs 模块，需要直接插入到页面中
          // bower: 将 bower 下载的代码复制到项目中去
          // clean:bower: 清空 bower 文件
          that.spawnCommand('grunt', ['bowerInstall', 'bower', 'clean:bower']);
        });
    } else if (this.name === 'test') {
      cmpName = 'git@git.ucweb.local:chenhc/cmp-' + this.name + '.git#' + this.ver;
      bower.commands
        .install([cmpName])
        .on('end', function (installed) {
          that.spawnCommand('grunt', ['bower', 'clean:bower']);
        });
    } else {
      cmpName = 'git@git.ucweb.local:pf/cmp-' + this.name + '.git#' + this.ver;
      bower.commands
        .install([cmpName])
        .on('end', function (installed) {
          // bower: 将 bower 下载的代码复制到项目中去
          // clean:bower: 清空 bower 文件
          that.spawnCommand('grunt', ['bower', 'clean:bower']);
        });
    }

    // 不用 this.bowerInstall 是因为没有 callback
    // this.bowerInstall([cmpName], { save: true });
  }

});

module.exports = CmpGenerator;
