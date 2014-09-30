#!/usr/bin/env node

'use strict';

// Environment default settings
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 9000;
process.env.HOST = process.env.HOST || '127.0.0.1';
process.env.RELOAD = process.env.RELOAD || 'off';

var baboon = require('../lib');

var path = require('path');
var rootPath = path.resolve(__dirname, '../../');
var debug = require('debug')('baboon');

debug('Start project.sh application config');

// load application Modules
baboon.LxLoader(rootPath, function (err, options) {

  // check errors and start server
  if (!err) {

    debug('application modules loaded');
    debug('start server');

    // start server
    var server = options.server;

    server.listen(options.config.PORT, options.config.HOST, function () {
      debug('Express server listening on port ' + server.address().port);
    });

  } else {
    throw new Error(err);
  }
});
