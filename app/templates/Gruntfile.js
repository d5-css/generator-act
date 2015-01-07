module.exports = function (grunt) {
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
                            'public/css/*.css'
                        ]
                    }
                }
            },
            // 生成可发布的 html
            processhtml: {
                dist: {
                    files: {}
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
                    dest: [],
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
            imagemin: {
                dist: {
                    options: {
                        optimizationLevel: 3
                    },
                    files: [{
                        expand: true,
                        cwd: 'public/images/',
                        src: ['*.{png,jpg,gif}'],
                        dest: 'public/images/'
                    }]
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
            'processhtml'
        ],
        clientConfig = grunt.file.readJSON('public/config/grunt.json'),
        DEV_HTML_PATH = 'public/views/',
        PLAY_VIEWS_PATH = 'app/japidviews/FrontendController/';

    // 翻译任务任务
    translate();

    // 前端开发模版转换为play模版任务
    htmlRelease();

    defaultTask = defaultTask.concat([
        'hashres',
        'usebanner',
        'clean:cmd',
        'imagemin:dist'
    ]);

    grunt.initConfig(initConfig);

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-cmd');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-hashres');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    // 发布任务
    grunt.registerTask('default', defaultTask);
    // grunt.registerTask('release', defaultTask);

    // 开发服务器任务
    grunt.registerTask('dev', [
        'express:dev',
        'watch'
    ]);

    // 添加模版转换任务
    function htmlRelease() {

        var htmlConfig = clientConfig.views,
            i;
        for (i = 0; i < htmlConfig.length; ++i) {
            var argsStr = '',
                config = htmlConfig[i],
                prePatterns = [{
                    match: /`/g,
                    replacement: ''
                }, {
                    match: /@/g,
                    replacement: '~@'
                }, {
                    match: /\$/g,
                    replacement: '~$'
                }, {
                    match: /~/g,
                    replacement: '~~'
                }],
                patterns;
            // 模版发布任务
            initConfig.processhtml.dist.files[PLAY_VIEWS_PATH + htmlConfig[i].html + '.html'] = [DEV_HTML_PATH + htmlConfig[i].html + '.html'];
            // hash任务
            initConfig.hashres.prod.dest.push(PLAY_VIEWS_PATH + htmlConfig[i].html + '.html');
            initConfig.replace['pre_' + config.html] = {
                options: {
                    patterns: prePatterns
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: PLAY_VIEWS_PATH + config.html + '.html',
                    dest: PLAY_VIEWS_PATH
                }]
            };
            defaultTask.push('replace:pre_' + config.html);
            if (config.args && config.args.length !== 0) {
                argsStr = __getArgsStr(config.args);
                patterns = __getArgsPatterns(config.args);
                patterns.push({
                    match: /<!DOCTYPE HTML>/gi,
                    replacement: argsStr
                });
                initConfig.replace[config.html] = {
                    options: {
                        patterns: patterns
                    },
                    files: [{
                        expand: true,
                        flatten: true,
                        src: PLAY_VIEWS_PATH + config.html + '.html',
                        dest: PLAY_VIEWS_PATH
                    }]
                };
                defaultTask.push('replace:' + config.html);
            }
        }
    }

    function __getArgsStr(args) {
        var i, argsStr = '`args ';
        for (i = 0; i < args.length; ++i) {
            argsStr += args[i].type + ' ';
            argsStr += args[i].name + ',';
        }
        argsStr = argsStr.substring(0, argsStr.length - 1);
        argsStr += '\n<!DOCTYPE HTML>';
        return argsStr;
    }

    function __getArgsPatterns(args) {
        var i, patterns = [];
        for (i = 0; i < args.length; ++i) {
            var replacement = '';
            if (args[i].type === 'String') {
                replacement = args[i].name + ': \'${' + args[i].name + '}\',';
            } else {
                replacement = args[i].name + ': ${' + args[i].name + '},';
            }
            patterns.push({
                match: new RegExp('/\\*\\s*render ' + args[i].name + '\\s*\\*/\\s*.*', 'gi'),
                replacement: replacement
            });
        }
        return patterns;
    }

    // 翻译任务任务
    function translate() {
        var i, j, LANGUAGES = clientConfig.languages.lang,
            FILES = clientConfig.languages.files,
            U2_FILES = clientConfig.languages.u2Files,
            lang, conf, watchFiles = [],
            watchTasks = [];
        for (i = 0; i < LANGUAGES.length; i++) {
            lang = LANGUAGES[i];
            conf = {
                options: {
                    patterns: [{
                        json: grunt.file.readJSON('languages/' + lang + '.json')
                    }]
                },
                files: []
            };
            for (j = 0; j < FILES.length; j++) {
                conf.files.push({
                    src: DEV_HTML_PATH + FILES[j] + '.html',
                    dest: DEV_HTML_PATH + FILES[j] + '_' + lang + '.html'
                });
            }
            for (j = 0; j < U2_FILES.length; j++) {
                conf.files.push({
                    src: PLAY_VIEWS_PATH + U2_FILES[j] + '.html',
                    dest: PLAY_VIEWS_PATH + U2_FILES[j] + '_' + lang + '.html'
                });
            }
            initConfig.replace[lang] = conf;
            defaultTask.unshift('replace:' + lang);
            watchTasks.push('replace:' + lang);
        }
        if (LANGUAGES && LANGUAGES.length > 0) {
            for (i = 0; i < FILES.length; i++) {
                watchFiles.push(DEV_HTML_PATH + FILES[i] + '.html');
            }
            initConfig.watch.translate = {
                files: watchFiles,
                tasks: watchTasks,
                options: {
                    livereload: true
                }
            };
            initConfig.watch.translate.files.push('languages/*');
        }
    }
};
