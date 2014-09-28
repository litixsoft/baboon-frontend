'use strict';

var SocketIO = require('socket.io');

/**
 * Socket.io Server
 *
 * @param options
 * @returns {SocketIO}
 */
module.exports = function(baboon, options, next) {


  // Check server parameter
  if (!options.server) {
    throw new Error('Parameter options.server required');
  }

  var debug = require('debug')('baboon.sh:socket.io');

  debug('Create socket.io server');

  // Create socket.io server
  options.socketIO = new SocketIO(options.server);

  next();
};

