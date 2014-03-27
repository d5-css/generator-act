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
        bower: {
            cmp: {
                dest: 'public/js/cmp'
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
        pack: {
            css: {
                type: 'css',
                src: [
                    '<%= meta.banner %>',
                    'public/css/**/*.css',
                ],
                dest: 'public/dist/style.min.css'
            },
            app: {
                type: 'js',
                options: {
                    base: '<%= cmd.all.dest %>'
                },
                src: [
                    '<%= meta.banner %>',
                    'public/js/cmp/vue.js',
                    '<%= cmd.all.dest %>/seajs/sea.js',
                    '<%= cmd.all.dest %>/**/*.js'
                ],
                dest: 'public/dist/app.min.js'
            }
        },
        processhtml: {
            dist: {
                files: {
                    'index_release.html': ['index.html']
                }
            }
        },
        clean: {
            cmd: ['<%= cmd.all.dest %>']
        }
    });

    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-processhtml');

    // public tasks
    grunt.registerTask('default', ['jshint', 'cmd', 'pack', 'processhtml', 'clean']);
};
