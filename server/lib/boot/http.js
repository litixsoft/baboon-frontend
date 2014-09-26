'use strict';

var http = require('http');

/**
 * Http server
 *
 * @param options
 * @param next
 */
module.exports = function (options, next) {

  var debug = require('debug')('baboon:http');

  debug('Create http server');

  if (!options.app) {
    throw new Error('Missing options.app, required for create server');
  }

  // Create http server
  var server = http.createServer(options.app);
  options.server = server;

  next();
};
