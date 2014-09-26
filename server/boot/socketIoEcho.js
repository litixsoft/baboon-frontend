'use strict';

/**
 * SocketIO echo server
 *
 * @param baboon
 * @param options
 * @param next
 */
module.exports = function (baboon, options, next) {

  var debug = require('debug')('baboon:socket-io-echo');
  debug('Create socket.io echo server');

  var io = options.socketIO;

  io.on('connection', function (socket) {

    debug('Client connect to socket.io');

    socket.on('echo', function (data, callback) {
      return callback(null, data);
    });
  });

  next();
};
