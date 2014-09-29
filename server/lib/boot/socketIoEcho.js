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

    socket.on('echoCallback', function (data, callback) {
      debug('echoCallback: receive message from client:' + socket.id);
      debug(data);

      // Return data with callback
      return callback(null, data);
    });

    socket.on('echoEvent', function (data) {
      debug('echoEvent: receive message from client:' + socket.id);
      debug(data);

      // Return data with emit
      return socket.emit('echoEvent', data);
    });
  });

  next();
};
