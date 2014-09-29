'use strict';

/**
 * SocketIO echo server
 *
 * @param baboon
 * @param options
 * @param next
 */
module.exports = function (options, next) {

  var debug = require('debug')('baboon:socket.io');
  debug('Create socket.io echo server');

  var io = options.socketIO;

  io.on('connection', function (socket) {

    debug('Client connect to socket.io');

    socket.on('echo', function (data, callback) {

      debug('echo: receive message from client:' + socket.id);
      debug(data);

      if (!callback) {

        debug('echo: callback not available push answer to client');
        socket.emit('echo', data);
      } else {

        debug('echo: callback present use callback for answer');
        callback(null, data);
      }
    });
  });

  next();
};
