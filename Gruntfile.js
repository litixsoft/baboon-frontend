'use strict';

var path = require('path');
var fs = require('fs');
var url = require('url');

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    /**
     * Gets the index.html file from the code coverage folder.
     *
     * @param {!string} folder The path to the code coverage folder.
     * @returns {string} The path to the index.html file
     */
    function getCoverageReport (folder) {
        var reports = grunt.file.expand(folder + '*/index.html');

        if (reports && reports.length > 0) {
            return reports[0];
        }

        return '';
    }

    /**
     * Connect rewrite middleware
     * Send static html app file in html5mode with toplevel apps
     *
     * @param {!object} req The request object
     * @param {!object} res The response object
     * @param {!string} root The base path of documents
     * @param {!function} next Callback for next function in stack
     */
    function connectRewrite (req, res, root, next) {

        var appFile = 'index.html';
        var urlPath = url.parse(req.url).pathname;
        var arr = urlPath.split('/');

        if (arr[1] !== 'main' || arr[1] !== '') {
            appFile = arr[1] + '.html';
        }

        if (!fs.existsSync(path.join(root, appFile))) {
            appFile = 'index.html';
        }

        fs.readFile(path.join(root, appFile), function (error, buffer) {
            if (error) {
                return next(error);
            }

            res.writeHead(200, {
                'Content-Type': 'text/html',
                'Content-Length': buffer.length
            });

            res.end(buffer);
        });
    }

    // Configurable paths for the application
    var appConfig = {
        app: 'app',
        dist: 'build/dist',
        reports: 'build/reports',
        lint: [
            'Gruntfile.js',
            'app/common/**/*.js',
            'app/lib/**/*.js',
            'app/modules/**/*.js',
            'config/**/*.js',
            'e2e/**/*.js'
        ]
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // Project settings
        yeoman: appConfig,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                files: ['<%= yeoman.app %>/modules/**/*.js', '<%= yeoman.app %>/common/**/*.js'],
                tasks: ['eslint:all']
            },
            jsTest: {
                files: ['<%= yeoman.app %>/modules/**/*.spec.js', '<%= yeoman.app %>/common/**/*.spec.js'],
                tasks: ['eslint:test', 'karma:unit']
            },
            styles: {
                files: ['<%= yeoman.app %>/**/*.less'],
                tasks: ['less', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '.tmp/css/**/*.css',
                    '<%= yeoman.app %>/*.html',
                    '<%= yeoman.app %>/{modules,common,assets}/**/*.html',
                    '<%= yeoman.app %>/{common,modules,assets,lib}/**/*.js',
                    '<%= yeoman.app %>/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35792
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function (connect) {
                        return [
                            connect.static('.tmp'),
                            connect.static(appConfig.app),
                            connect().use('/', function (req, res, next) {
                                connectRewrite(req, res, appConfig.app, next);
                            })
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            connect.static('.tmp'),
                            connect.static(appConfig.app),
                            connect().use('/', function (req, res, next) {
                                connectRewrite(req, res, appConfig.app, next);
                            })
                        ];
                    }
                }
            },
            testDist: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            connect.static(appConfig.dist),
                            connect().use('/', function (req, res, next) {
                                connectRewrite(req, res, appConfig.dist, next);
                            })
                        ];
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    middleware: function (connect) {
                        return [
                            connect.static(appConfig.dist),
                            connect().use('/', function (req, res, next) {
                                connectRewrite(req, res, appConfig.dist, next);
                            })
                        ];
                    }
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        eslint: {
            all: {
                src: '<%= yeoman.lint %>'
            },
            test: {
                src: [
                    '<%= yeoman.app %>/app/**/*.spec.js',
                    '<%= yeoman.app %>/common/**/*.spec.js'
                ]
            },
            jslint: {
                options: {
                    format: 'jslint-xml',
                    'output-file': '<%= yeoman.reports %>/lint/eslint.xml'
                },
                files: {
                    src: '<%= yeoman.lint %>'
                }
            },
            checkstyle: {
                options: {
                    format: 'checkstyle',
                    'output-file': '<%= yeoman.reports %>/lint/eslint_checkstyle.xml'
                },
                files: {
                    src: '<%= yeoman.lint %>'
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= yeoman.dist %>/**/*',
                            '!<%= yeoman.dist %>/.git*'
                        ]
                    }
                ]
            },
            server: '.tmp',
            lib: 'app/lib/**/*.annotated.js',
            test: '<%= yeoman.reports %>/test',
            jslint: '<%= yeoman.reports %>/jslint',
            coverage: '<%= yeoman.reports %>/coverage'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/css/',
                        src: '**/*.css',
                        dest: '.tmp/css/'
                    }
                ]
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= yeoman.dist %>/app/**/*.js',
                    '<%= yeoman.dist %>/assets/css/**/*.css',
                    '<%= yeoman.dist %>/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= yeoman.dist %>/assets/fonts/*'
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: ['<%= yeoman.app %>/*.html'],
            options: {
                dest: '<%= yeoman.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.dist %>/**/*.html'],
            css: ['<%= yeoman.dist %>/assets/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/assets/images']
            }
        },

        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/assets/images',
                        src: '{,*/}*.{png,jpg,jpeg,gif}',
                        dest: '<%= yeoman.dist %>/assets/images'
                    }
                ]
            }
        },

        svgmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/assets/images',
                        src: '{,*/}*.svg',
                        dest: '<%= yeoman.dist %>/assets/images'
                    }
                ]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['*.html', '**/*.html'],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },

        uglify: {
            release: {
                options: {
                    sourceMap: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'app/lib',
                        src: '**/*annotated.js',
                        dest: 'app/lib',
                        rename: function (dest, src) {
                            return dest + '/' + src.replace('annotated', 'min');
                        }
                    }
                ]
            }
        },

        // ngAnnotate tries to make the code safe for minification automatically by
        // using the Angular long form for dependency injection. It doesn't work on
        // things like resolve or inject so those have to be done manually.
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/concat',
                        src: '**/*.js',
                        dest: '.tmp/concat'
                    }
                ]
            },
            release: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/lib',
                        src: ['**/*.js', '!**/*.spec.js', '!**/*.min.js'],
                        ext: '.annotated.js',
                        dest: 'app/lib'
                    }
                ]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            '.htaccess',
                            '*.html',
                            '{,*/}*.html',
                            'assets/**'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= yeoman.dist %>/assets/images',
                        src: ['generated/*']
                    },
                    {
                        expand: true,
                        cwd: 'app/bower_components/bootstrap/dist',
                        src: 'fonts/*',
                        dest: '<%= yeoman.dist %>/assets'
                    },
                    {
                        expand: true,
                        cwd: 'app/bower_components/fontawesome',
                        src: 'fonts/*',
                        dest: '<%= yeoman.dist %>/assets'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: ['common/**/*.html', 'modules/**/*.html']
                    }
                ]
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'less'
            ],
            test: [
                'less'
            ],
            dist: [
                'less',
                'imagemin',
                'svgmin'
            ]
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'config/karma.conf.js',
                singleRun: true
            },
            dist: {
                configFile: 'config/karma.dist.conf.js',
                singleRun: true
            },
            coverage: {
                configFile: 'config/karma.coverage.conf.js'
            },
            ci: {
                configFile: 'config/karma.conf.js',
                reporters: ['mocha', 'junit'],
                junitReporter: {
                    outputFile: '<%= yeoman.reports %>/test/client/karma.xml',
                    suite: 'karma'
                }
            },
            cobertura: {
                configFile: 'config/karma.coverage.conf.js',
                coverageReporter: {
                    type: 'cobertura',
                    dir: '<%= yeoman.reports %>/coverage'
                }
            }
        },

        // Open browser for livereload or coverage
        open: {
            coverage: {
                path: function () {
                    return path.join(__dirname, getCoverageReport('build/reports/coverage/'));
                }
            }
        },

        // Build css files
        less: {
            target: {
                options: {
                    paths: ['<%= yeoman.app %>/less']
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/modules',
                        src: ['**/*.less'],
                        dest: '.tmp/css/',
                        ext: '.css'
                    }
                ]
            }
        },

        // Run commands
        bgShell: {
            updateWebdriver: {
                cmd: 'node node_modules/protractor/bin/webdriver-manager update',
                fail: true
            },
            protractor: {
                cmd: 'node node_modules/protractor/bin/protractor config/e2e.conf.js',
                fail: true
            }
        },

        // Update CHANGELOG.md
        changelog: {
            options: {}
        },

        // Update version, changelog and commit
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: ['pkg'],
                commitFiles: ['.'],
                commitMessage: 'chore: release v%VERSION%',
                push: false
            }
        },
        ngdocs: {
            options: {
                dest: 'docs',
                scripts: ['angular.js', '../src.js'],
                html5Mode: false
            },
//          tutorial: {
//              src: ['content/tutorial/*.ngdoc'],
//              title: 'Tutorial'
//          },
            api: {
                src: ['app/lib/**/*.js', '!app/lib/**/*.spec.js', '!app/lib/**/*.min.js'],
                title: 'API Documentation'
            }
        }
    });

    grunt.registerTask('docs', ['ngdocs']);

    grunt.registerTask('git:commitHook', 'Install git commit hook', function () {
        grunt.file.copy('validate-commit-msg.js', '.git/hooks/commit-msg');
        require('fs').chmodSync('.git/hooks/commit-msg', '0755');
        grunt.log.ok('Registered git hook: commit-msg');
    });

    grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'build:dev',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'eslint:all',
        'build:dev',
        'karma:unit'
    ]);

    grunt.registerTask('test:dist', [
        'eslint:all',
        'build',
        'build:release',
        'karma:dist',
        'bgShell:updateWebdriver',
        'connect:testDist',
        'bgShell:protractor'
    ]);

    grunt.registerTask('e2e', [
        'bgShell:updateWebdriver',
        'build:dev',
        'connect:test',
        'bgShell:protractor'
    ]);

    // test scenarios production mode
    grunt.registerTask('e2e:dist', [
        'bgShell:updateWebdriver',
        'build',
        'connect:testDist',
        'bgShell:protractor'
    ]);

    grunt.registerTask('cover', [
        'build:dev',
        'clean:coverage',
        'connect:test',
        'karma:coverage',
        'open:coverage'
    ]);

    grunt.registerTask('ci', [
        'clean:test',
        'clean:coverage',
        'clean:jslint',
        'eslint:jslint',
        'eslint:checkstyle',
        'build:dev',
        'connect:test',
        'karma:ci',
        'karma:coverage',
        'karma:cobertura'
    ]);

    grunt.registerTask('build:dev', [
        'clean:server',
        'concurrent:server',
        'autoprefixer'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'ngAnnotate:dist',
        'copy:dist',
        'cssmin',
        'uglify:generated',
        'filerev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('build:release', [
        'clean:lib',
        'ngAnnotate:release',
        'uglify:release',
        'clean:lib'
    ]);

    grunt.registerTask('release', 'Bump version, update changelog and tag version', function (version) {
        grunt.task.run([
            'docs',
            'build:release',
                'bump:' + (version || 'patch') + ':bump-only',
            'changelog',
            'bump-commit'
        ]);
    });

    grunt.registerTask('default', ['test']);
};
