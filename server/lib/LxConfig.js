'use strict';

var path = require('path');
var _ = require('lodash');

/**
 * Application configuration
 *
 * @param rootPath
 * @returns {{}}
 */
var LxConfig = function (rootPath) {

  var self = {};
  var debug = require('debug')('baboon:LxConfig');

  // Paths
  self.ROOT_PATH = rootPath;
  self.API_PATH = path.join(rootPath, 'server', 'api');
  self.BOOT_PATH = path.join(rootPath, 'server', 'boot');
  self.CONFIG_PATH = path.join(rootPath, 'server', 'config');

  // Environment
  self.NODE_ENV = process.env.NODE_ENV;
  self.PORT = process.env.PORT;
  self.HOST = process.env.HOST;
  self.RELOAD = process.env.RELOAD;

  var baseConfig = require(path.join(self.CONFIG_PATH, 'base.json'));
  var config = _.merge(baseConfig, require(path.join(self.CONFIG_PATH, self.NODE_ENV + '.json')) || {});
  self = _.merge(config, self);

  debug('Configuration loaded:', self);

  return self;
};

module.exports = LxConfig;
