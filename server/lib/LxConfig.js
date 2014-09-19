'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var path = require('path');

/**
 * Application configuration
 *
 * @param rootPath
 * @returns {{}}
 */
var LxConfig = function (rootPath) {

    var self = {};

    self.ROOT_PATH = rootPath;
    self.API_PATH = path.join(rootPath, 'server', 'api');
    self.LIB_PATH = path.join(rootPath, 'server', 'lib');

    self.NODE_ENV = process.env.NODE_ENV;
    self.PORT = process.env.PORT;
    self.HOST = process.env.HOST;

    self.MONGODB = [
        {url: 'mongodb://localhost:27017/baboon-backend-test', name: 'bbTest'}
    ];

    return self;
};

module.exports = LxConfig;
