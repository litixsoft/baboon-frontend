#!/usr/bin/env node

'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Options parameters
var options = {};

var path = require('path');
var rootPath = path.resolve(__dirname, '../../');

var lib = require('../lib');
var debug = require('debug')('baboon');

// Config
var config = new lib.LxConfig(rootPath);
options.config = config;

// Express application
var app = require('../app.js') (options);
options.app = app;

// Http server
var server = require('http').createServer(app);
options.server = server;

// Socket.io
//var io = require('../socket.io.js')(options);

//var db = lib.lxMongoDb;
//
//// Connect to databases
//db.connect(config.MONGODB);
//
//// Exit when databases connect error
//db.on('connect_error', function (err) {
//  throw err;
//});
//
//// Init and start application after successfully connect
//db.once('connect', function () {
//
//  // Init application
//  var server = new Server(config, db);
//

// start server
server.listen(config.PORT, config.HOST, function () {
  debug('Express server listening on port ' + server.address().port);
});

//});

// Expose app
exports = module.exports = app;
