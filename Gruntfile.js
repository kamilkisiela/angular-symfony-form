// Gruntfile.js
module.exports = function (grunt) {
    "use strict";
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),
        'meta': {
            'jsFilesForTesting': [
                'bower_components/angular/angular.js',
                'bower_components/angular-mocks/angular-mocks.js',
                'test/**/*.spec.js'
            ]
        },
        'karma': {
            'development': {
                'configFile': 'karma.conf.js',
                'options': {
                    'files': [
                        '<%= meta.jsFilesForTesting %>',
                        'tmp/**/*.js'
                    ],
                }
            },
            'dist': {
                'options': {
                    'configFile': 'karma.conf.js',
                    'files': [
                        '<%= meta.jsFilesForTesting %>',
                        'dist/<%= pkg.name %>.js'
                    ],
                }
            },
            'minified': {
                'options': {
                    'configFile': 'karma.conf.js',
                    'files': [
                        '<%= meta.jsFilesForTesting %>',
                        'dist/<%= pkg.name %>.min.js'
                    ],
                }
            }
        },
        'jshint': {
            options: {
                jshintrc: '.jshintrc'
            },
            'beforeconcat': ['src/**/*.js'],
        },
        'concat': {
            'dist': {
                'src': ['tmp/**/*.js'],
                'dest': 'dist/<%= pkg.name %>.js'
            }
        },

        "babel": {
            options: {
                sourceMap: false
            },
            dist: {
                files: {
                    "tmp/main.js": "src/main.js"
                }
            }
        },

        browserify: {
            dist: {
                options: {
                    transform: [["babelify", {"stage": 0}]]
                },
                files: {
                    "tmp/main.js": "src/main.js"
                }
            }
        },

        'uglify': {
            'options': {
                'mangle': false
            },
            'dist': {
                'files': {
                    'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
                }
            }
        },

        "clean": {
            "tmp": ['tmp']
        }
    });
    grunt.registerTask('test', [
        'clean:tmp',
        'jshint',
        'browserify',
        'karma:development'
    ]);
    grunt.registerTask('build', [
        'test',
        'concat',
        'clean:tmp',
        'karma:dist',
        'uglify',
        'karma:minified'
        //'jsdoc'
    ]);
};