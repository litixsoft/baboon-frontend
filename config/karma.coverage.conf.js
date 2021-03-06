'use strict';

// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-06-17 using
// generator-karma 0.8.2

module.exports = function (config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'app/components/angular/angular.js',
            'app/components/angular-route/angular-route.js',
            'app/components/angular-messages/angular-messages.js',
            'app/components/angular-mocks/angular-mocks.js',
            'app/components/@uirouter/angularjs/release/angular-ui-router.js',
            'app/components/angular-bootstrap/ui-bootstrap-tpls.js',
            'app/components/angular-socket-io/socket.js',
            'app/lib/**/*.js',
            'app/common/**/*.js',
            'app/modules/**/*.js'
        ],

        // list of files / patterns to exclude
        exclude: [
            'app/lib/**/*.min.js'
        ],

        // use dots reporter, as travis terminal does not support escaping sequences
        // possible values: 'dots', 'progress'
        // CLI --reporters progress
        reporters: ['mocha', 'coverage'],

        preprocessors: {
            'app/lib/**/*.js': 'coverage',
            'app/modules/**/*.js': 'coverage',
            'app/common/**/*.js': 'coverage'
        },

        coverageReporter: {
            type: 'html',
            dir: 'build/reports/coverage'
        },

        // web server port
        // CLI --port 9876
        port: 8080,

        // enable / disable colors in the output (reporters and logs)
        // CLI --colors --no-colors
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        // CLI --log-level debug
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        // CLI --auto-watch --no-auto-watch
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        // CLI --browsers Chrome,Firefox,Safari
        browsers: ['Chrome'],

        // If browser does not capture in given timeout [ms], kill it
        // CLI --capture-timeout 5000
        captureTimeout: 20000,

        // Auto run tests on start (when browsers are captured) and exit
        // CLI --single-run --no-single-run
        singleRun: true,

        // report which specs are slower than 500ms
        // CLI --report-slower-than 500
        reportSlowerThan: 500
    });
};
