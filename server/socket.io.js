'use strict';

var SocketIO = require('socket.io');

module.exports = function(options) {

  var server = options.server;
  var config = options.config;

  if (!server || !config) {
    throw new Error('Parameter options.server and options.config required');
  }

  // Return new Socket.io server instance
  return new SocketIO(server);
};
