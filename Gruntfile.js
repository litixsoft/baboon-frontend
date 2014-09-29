// Generated on 2014-06-17 using generator-angular 0.9.0-1
'use strict';

var path = require('path');

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  /**
   * Gets the index.html file from the code coverage folder.
   *
   * @param {!string} folder The path to the code coverage folder.
   */
  function getCoverageReport(folder) {
    var reports = grunt.file.expand(folder + '*/index.html');

    if (reports && reports.length > 0) {
      return reports[0];
    }

    return '';
  }

  // Configurable paths for the application
  var appConfig = {
    app: 'app',
    dist: 'build/dist',
    reports: 'build/reports'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
    ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
    ' *\n' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
    ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
    ' */\n\n',

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= yeoman.app %>/modules/**/*.js', '<%= yeoman.app %>/common/**/*.js'],
        tasks: ['jshint:all']
      },
      jsTest: {
        files: ['<%= yeoman.app %>/modules/**/*.spec.js', '<%= yeoman.app %>/common/**/*.spec.js'],
        tasks: ['jshint:test', 'karma:unit']
      },
      styles: {
        files: ['<%= yeoman.app %>/**/*.less'],
        tasks: ['less', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          '.tmp/css/**/*.css',
          '<%= yeoman.app %>/*.html',
          '<%= yeoman.app %>/{modules,common,assets}/**/*.html',
          '<%= yeoman.app %>/{common,modules,assets}/**/*.js',
          '<%= yeoman.app %>/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        options: {
          livereload: true
        }
      },
      express: {
        files: [
          'server/**/*.{js,json}'
        ],
        tasks: ['express:dev', 'wait'],
        options: {
          livereload: true,
          nospawn: true //Without this option specified express won't be reloaded
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/app/**/*.js',
          '<%= yeoman.app %>/common/**/*.js'
        ]
      },
      test: {
        src: [
          '<%= yeoman.app %>/app/**/*.spec.js',
          '<%= yeoman.app %>/common/**/*.spec.js'
        ]
      },
      jslint: {
        options: {
          reporter: 'jslint',
          reporterOutput: '<%= yeoman.reports %>/lint/jshint.xml'
        },
        files: {
          src: [
            'Gruntfile.js',
            '<%= yeoman.app %>/app/**/*.js',
            '<%= yeoman.app %>/common/**/*.js'
          ]
        }
      },
      checkstyle: {
        options: {
          reporter: 'checkstyle',
          reporterOutput: '<%= yeoman.reports %>/lint/jshint_checkstyle.xml'
        },
        files: {
          src: [
            'Gruntfile.js',
            '<%= yeoman.app %>/app/**/*.js',
            '<%= yeoman.app %>/common/**/*.js'
          ]
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
      test: '<%= yeoman.reports %>/test',
      jslint: '<%= yeoman.reports %>/jslint',
      coverage: '<%= yeoman.reports %>/coverage',
      coverageE2E: '.tmp/instrumentedE2E'
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

    // ngmin tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '.tmp/concat',
            src: '**/*.js',
            dest: '.tmp/concat'
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
            cwd: 'bower_components/bootstrap/dist',
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

    // Set environment
    env: {
      dev: {
        NODE_ENV: 'development',
        DEBUG: 'baboon*',
        RELOAD: true
      },
      pro: {
        NODE_ENV: 'production',
        DEBUG: 'baboon*'
      },
      e2eDist : {
        NODE_ENV: 'production',
        DEBUG: 'baboon*',
        PORT: 9001
      }
    },

    // Backend server for livereload
    express: {
      options: {
        port: 9000,
        host: '127.0.0.1'
      },
      dev: {
        options: {
          script: 'server/bin/www.js',
          debug: true,
          delay: 10
        }
      },
      test: {
        options: {
          port: 9001,
          script: 'server/bin/www.js',
          debug: true,
          delay: 10
        }
      },
      pro: {
        options: {
          script: 'server/bin/www.js',
          debug: false,
          delay: 10
        }
      }
    },

    // Open browser for livereload or coverage
    open: {
      server: {
        url: 'http://<%= express.options.host %>:<%= express.options.port %>'
      },
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
        files: ['package.json'],
        updateConfigs: ['pkg'],
        commitFiles: ['.'],
        commitMessage: 'chore: release v%VERSION%',
        push: false
      }
    }
  });

  // Register tasks.
  grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
    this.async();
  });

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });


  grunt.registerTask('git:commitHook', 'Install git commit hook', function () {
    grunt.file.copy('validate-commit-msg.js', '.git/hooks/commit-msg');
    require('fs').chmodSync('.git/hooks/commit-msg', '0755');
    grunt.log.ok('Registered git hook: commit-msg');
  });

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'env:pro', 'express:pro', 'wait', 'open:server', 'express-keepalive']);
    }

    grunt.task.run([
      'build:dev',
      'env:dev',
      'express:dev',
      'wait',
      'open:server',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'jshint:test',
    'jshint:all',
    'build:dev',
    'express:test',
    'karma:unit'
  ]);

  grunt.registerTask('e2e', [
    'bgShell:updateWebdriver',
    'build:dev',
    'env:dev',
    'express:test',
    'bgShell:protractor'
  ]);

  // test scenarios production mode
  grunt.registerTask('e2e:dist', [
    'bgShell:updateWebdriver',
    'build',
    'env:e2eDist',
    'express:test',
    'bgShell:protractor'
  ]);

  grunt.registerTask('cover', [
    'build:dev',
    'clean:coverage',
    'express:test',
    'karma:coverage',
    'open:coverage'
  ]);

  grunt.registerTask('ci', [
    'clean:test',
    'clean:coverage',
    'clean:jslint',
    'jshint:jslint',
    'jshint:checkstyle',
    'build:dev',
    'express:test',
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
    'ngmin',
    'copy:dist',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('release', 'Bump version, update changelog and tag version', function (version) {
    grunt.task.run([
      'bump:' + (version || 'patch') + ':bump-only',
      'changelog',
      'bump-commit'
    ]);
  });

  grunt.registerTask('default', ['test']);
};
