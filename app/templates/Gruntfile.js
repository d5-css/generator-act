module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
        },
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
        // 将bower依赖的文件复制到项目中
        bower: {
            cmp: {
                dest: 'public/js/cmp'
            }
        },
        bowerInstall: {
            target: {
                src: [
                    '*.html'
                ],
                exclude: ['cmp-*'],
            }
        },
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
            options: {
                banner: '<%= meta.banner %>\n',
            },
            js: {
                files: {
                    'public/dist/app-<%= pkg.version %>.js': [
                        'public/js/cmp/vue.js',
                        '<%= cmd.all.dest %>/seajs/sea.js',
                        '<%= cmd.all.dest %>/**/*.js'
                    ]
                }
            }
        },
        // 压缩 css
        cssmin: {
            add_banner: {
                options: {
                    keepSpecialComments: 0, // removing all
                    banner: '<%= meta.banner %>'
                },
                files: {
                    'public/dist/style-<%= pkg.version %>.css': [
                        'public/css/**/*.css'
                    ]
                }
            }
        },
        // 替换静态文件版本号
        replace: {
            // 发布
            dist: {
                options: {
                    patterns: [{
                        match: /\/app\-[v\d\.]+\.js/g,
                        replacement: '/app-<%= pkg.version %>.js'
                    }, {
                        match: /\/style\-[v\d\.]+\.css/g,
                        replacement: '/style-<%= pkg.version %>.css'
                    }]
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['*.html'],
                    dest: ''
                }]
            }
        },
        // 生成可发布的 html
        processhtml: {
            dist: {
                files: {
                    'index_release.html': ['index.html']
                }
            }
        },
        // 清除 cmd 生成的文件
        clean: {
            bower: ['bower_components'],
            cmd: ['<%= cmd.all.dest %>']
        },
        express: {
            options: {
                port: 4000
            },
            dev: {
                options: {
                    script: 'express/server.js'
                }
            }
        },
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
                    '<%= cmd.all.src %>',
                ],
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-bower-install');
    grunt.loadNpmTasks('grunt-cmd');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 打包任务
    grunt.registerTask('default', [
        'jshint',
        'bower',
        'cmd',
        'uglify',
        'cssmin',
        'replace',
        'processhtml',
        'clean:cmd'
    ]);

    // 开发服务器任务
    grunt.registerTask('dev', [
        'express:dev',
        'watch'
    ]);
};
