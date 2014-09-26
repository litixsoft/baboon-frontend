'use strict';

var LxConfig = require('./LxConfig');
var path = require('path');
var _ = require('lodash');
var async = require('async');

/**
 * Load the application modules
 * @param rootPath
 */
module.exports = function (rootPath, callback) {

  // Options for share between modules
  var options = {};
  var debug = require('debug')('baboon:LxLoader');
  var syncTasks = [];

  debug('Load configuration');

  // Config
  var config = new LxConfig(rootPath);
  options.config = config;

  debug('Prepare boot sequence');
  // prepare boot sequence
  _.forIn(config.BOOT_CONFIG, function (value, key) {

    // Check value and push to task array
    if (value) {
      debug('add module ' + key + ' to boot tasks');
      syncTasks.push(function (callback) {
        require(path.join(config.BOOT_PATH, key))(options, callback);
      });
    }
  });

  debug('run boot tasks')
  // run boot modules with async series
  async.series(syncTasks, function (err) {

    if (!err) {
      callback(null, options);
    } else {
      callback(err);
    }
  });
};
