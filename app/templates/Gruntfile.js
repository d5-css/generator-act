module.exports = function(grunt) {
    'use strict';

    var initConfig = {
            pkg: grunt.file.readJSON('package.json'),
            meta: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            // 代码检查
            jshint: {
                all: [
                    'public/js/**/*.js'
                ],
                options: {
                    jshintrc: '.jshintrc',
                    ignores: [
                        'public/js/seajs/*.js',
                        'public/js/cmp/*.js'
                    ],
                }
            },
            // 将 bower 依赖的文件复制到项目中
            bower: {
                cmp: {
                    dest: 'public/js/cmp'
                }
            },
            // 将 <script src="vue"> 写到 index_dev.html 中
            'sails-linker': {
                vue: {
                    files: {
                        'index_dev.html': ['public/js/cmp/vue*.js']
                    },
                },
            },
            // 转换 cmd 文件
            cmd: {
                options: {
                    base: 'public/js/',
                    shim: {}
                },
                all: {
                    src: [
                        'public/js/**/*.js'
                    ],
                    ignores: [
                        'public/js/cmp/vue.js',
                    ],
                    dest: 'public/compiled'
                }
            },
            // 压缩 js
            uglify: {
                js: {
                    files: {
                        'public/dist/app.js': [
                            'public/js/cmp/vue.js',
                            '<%= cmd.all.dest %>/seajs/sea.js',
                            '<%= cmd.all.dest %>/**/*.js'
                        ]
                    }
                }
            },
            // 压缩 css
            cssmin: {
                'add_banner': {
                    options: {
                        keepSpecialComments: 0 // removing all
                    },
                    files: {
                        'public/dist/style.css': [
                            'public/css/**/*.css'
                        ]
                    }
                }
            },
            // 生成可发布的 html
            processhtml: {
                dist: {
                    files: {
                        'app/japidviews/FrontendController/index.html': ['app/japidviews/FrontendController/index_dev.html']
                    }
                }
            },
            // 将静态文件按 md5 命名
            hashres: {
                options: {
                    encoding: 'utf8',
                    fileNameFormat: '${name}.${hash}.${ext}',
                    renameFiles: true
                },
                prod: {
                    src: [
                        'public/dist/app.js',
                        'public/dist/style.css'
                    ],
                    dest: 'app/japidviews/FrontendController/index.html',
                }
            },
            // 给 md5 的静态文件添加 banner
            usebanner: {
                md5: {
                    options: {
                        banner: '<%= meta.banner %>',
                    },
                    files: {
                        src: ['public/dist/*']
                    }
                }
            },
            // 清除 cmd 生成的文件
            clean: {
                bower: ['bower_components'],
                cmd: ['<%= cmd.all.dest %>'],
                dist: ['public/dist']
            },
            // 开发服务器
            express: {
                options: {
                    port: 9000
                },
                dev: {
                    options: {
                        script: 'express/server.js'
                    }
                }
            },
            // 监听
            watch: {
                express: {
                    files: [
                        'express/*.js'
                    ],
                    tasks: ['express:dev'],
                    options: {
                        spawn: false
                    }
                },
                project: {
                    files: [
                        'public/**/*'
                    ],
                    options: {
                        livereload: true
                    }
                }
            },
            replace: {}
        },
        defaultTask = [
            'jshint',
            'cmd',
            'clean:dist',
            'uglify',
            'cssmin',
            'processhtml',
            'hashres',
            'usebanner',
            'clean:cmd'
        ];

    // 前端开发模版转换为play模版
    htmlRelease();

    grunt.initConfig(initConfig);

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-sails-linker');
    grunt.loadNpmTasks('grunt-cmd');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-hashres');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 打包任务
    grunt.registerTask('default', defaultTask);

    // 开发服务器任务
    grunt.registerTask('dev', [
        'express:dev',
        'watch'
    ]);

    // 前端开发模版转换为play模版
    function htmlRelease() {

        var htmlConfig = grunt.file.readJSON('public/config/grunt.json').replaceRelease,
            i, j;

        for (i = 0; i < htmlConfig.length; ++i) {
            var argsReplacement = '',
                config = htmlConfig[i];

            initConfig.replace[config.html] = {
                options: {
                    patterns: []
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: 'public/views/' + config.html + '.html',
                    dest: 'app/japidviews/FrontendController/'
                }]
            };
            if (config.args && config.args.length !== 0) {
                argsReplacement += '`args ';
                for (j = 0; j < config.args.length; ++j) {
                    var replacement = '';
                    argsReplacement += config.args[j].type + ' ';
                    argsReplacement += config.args[j].name + ',';
                    if (config.args[j].type === 'String') {
                        replacement = config.args[j].name + ': \'${' + config.args[j].name + '}\',';
                    } else {
                        replacement = config.args[j].name + ': ${' + config.args[j].name + '},';
                    }
                    initConfig.replace[config.html].options.patterns.push({
                        match: new RegExp('/\\*\\s*render ' + config.args[j].name + '\\s*\\*/\\s*.*', 'gi'),
                        replacement: replacement
                    });
                }
                argsReplacement = argsReplacement.substring(0, argsReplacement.length - 1);
                argsReplacement += '\n<!DOCTYPE HTML>';
            }
            initConfig.replace[config.html].options.patterns.push({
                match: /<!DOCTYPE HTML>/gi,
                replacement: argsReplacement
            });
            defaultTask.unshift('replace:' + config.html);
        }
    }
};
