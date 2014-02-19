/**
 * Gruntfile for Elf Project
 */

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        jshint: {
            all: [
                '../public/js/core/*.js',
                '../public/js/component/*.js',
                '../public/js/widget/*.js',
                '../public/js/page/*.js'
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
                predef: ['seajs', 'define'],
                white: false
            }
        },
        cmd: {
            options: {
                base: '../public/js/',
                shim: {}
            },
            all: {
                src: [
                    '../public/js/*/*.js'
                ],
                dest: '../public/compiled'
            }
        },
        pack: {
            css: {
                type: 'css',
                src: [
                    '<%= meta.banner %>',
                    '../public/css/style.css',
                    '../public/css/mascot.css',
                ],
                dest: '../public/css/style.min.css'
            },
            app: {
                type: 'js',
                options: {
                    base: '<%= cmd.all.dest %>'
                },
                src: [
                    '<%= meta.banner %>',
                    '<%= cmd.all.dest %>/seajs/sea.js',
                    '<%= cmd.all.dest %>/avalon/*.js',
                    '<%= cmd.all.dest %>/core/*.js',
                    '<%= cmd.all.dest %>/component/*.js',
                    '<%= cmd.all.dest %>/widget/*.js',
                    '<%= cmd.all.dest %>/page/*.js'
                ],
                dest: '../public/js/app.min.js'
            }
        }
    });

    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // public tasks
    grunt.registerTask('default', ['jshint', 'cmd', 'pack']);
};