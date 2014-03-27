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
                bitwise: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                forin: true,
                immed: true,
                indent: 4,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                nonew: true,
                quotmark: 'single',
                undef: true,
                unused: true,
                strict: true,
                trailing: true,
                eqnull: true,
                browser: true,
                devel: true,
                jquery: true,
                node: true,
                predef: ['seajs', 'define', 'Vue'],
                white: false,

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
                    'public/dist/app.min.js': [
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
                    'public/dist/style.min.css': [
                        'public/css/**/*.css'
                    ]
                }
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
            cmd: ['<%= cmd.all.dest %>']
        }
    });

    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-bower-install');
    grunt.loadNpmTasks('grunt-processhtml');

    // public tasks
    grunt.registerTask('default', [
        'jshint',
        'bower',
        'cmd',
        'uglify',
        'cssmin',
        'processhtml',
        'clean'
    ]);
};
