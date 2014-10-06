'use strict';

angular.module('bbc.transport', ['btford.socket-io'])
/**
 * @ngdoc object
 * @name bbc.transport.$bbcSocket
 *
 * @description
 * Service for socket connection.
 *
 * @param {object} socketFactory The socket io object
 */
  .factory('$bbcSocket', function (socketFactory) {
    var pub = {};

    function Connection(host, connectTimeout) {
      var connection = io.connect(host, {'connect timeout': connectTimeout});

      return {
        socket: socketFactory({
          // Creates a new socket connection.
          ioSocket: connection
        }),
        connection: connection
      };
    }

    /**
     * @ngdoc method
     * @name bbc.transport.$bbcSocket#createSocket
     * @methodOf bbc.transport.$bbcSocket
     *
     * @description
     * Set navigation with app and route of app
     *
     * @param {string} host The host connection string
     * @param {number} connectTimeout The connection timeout
     */
    pub.createSocket = function (host, connectTimeout) {
      // when 2 is callback in data, rewrite this
      if (arguments.length !== 2) {
        throw new TypeError('Param "host" and "connectTimeout" are required');
      }

      // check host
      if (typeof host !== 'string' || host.length === 0) {
        throw new TypeError('Param "host" is required and must be of type string!');
      }

      // check connectTimeout
      if (typeof connectTimeout !== 'number' || connectTimeout < 0) {
        throw new TypeError('Param "connectTimeout" is required and must be of type number and greater than 0!');
      }

      return new Connection(host, connectTimeout);
    };

    return pub;
  })

/**
 * @ngdoc object
 * @name bbc.transport.$bbcTransport
 * @requires $timeout
 *
 * @description
 * Service for transport. It can either use a socket connection or a rest connection. The option which communication
 * to use is useSocket.
 *
 * For more information look at the [guide](/transport).
 *
 */
  .provider('$bbcTransport', function () {
    var config = {};

    /**
     * @ngdoc method
     * @name bbc.transport.$bbcTransport#set
     * @methodOf bbc.transport.$bbcTransport
     *
     * @description
     * Setup the transport configuration
     *
     * @param {object} options The options for config
     */
    this.set = function (options) {
      options = options || {};

      // default settings
      config.protocol = options.protocol;
      config.hostname = options.hostname;
      config.port = options.port;

      if (options.hasOwnProperty('useSocket')) {
        config.useSocket = options.useSocket;
      } else {
        config.useSocket = true;
      }

      config.connectTimeout = options.connectTimeout || 5000;
      config.socketResponseTimeout = options.socketResponseTimeout || 5000;
    };

    this.$get = function ($rootScope, $http, $bbcSocket, $window, $log, $timeout) {
      var pub = {};

      var socket;
      var socketConnection;

      // default settings when options is empty
      config.protocol = config.protocol || $window.location.protocol;
      config.hostname = config.hostname || $window.location.hostname;
      config.port = config.port || parseInt($window.location.port);

      // fix protocol when forgotten :
      if (config.protocol === 'http' || config.protocol === 'https' ||
        config.protocol === 'ws' || config.protocol === 'wss') {
        config.protocol = config.protocol + ':';
      }

      if (!config.port || config.port === 443 || config.port === 80) {

        // create the host url without port
        config.host = config.protocol + '//' + config.hostname;
      }
      else {

        // create the host url with port
        config.host = config.protocol + '//' + config.hostname + ':' + config.port;
      }

      // default socket is not enabled
      $rootScope.socketEnabled = false;

      /**
       * Register socket events
       *
       * @param socket
       */
      var registerSocketEvents = function (socket) {
        // socket connect event, change transportSocket to true.
        socket.on('connecting', function () {
          $log.info('socket: connecting to ', config.host);
        });

        // socket connect event, change transportSocket to true.
        socket.on('connect', function () {
          $log.info('socket: connected');
          $rootScope.socketEnabled = true;
        });

        // socket disconnect event, change transportSocket to false.
        socket.on('disconnect', function () {
          $log.warn('socket: disconnected');
          $rootScope.socketEnabled = false;
        });

        // socket error event
        socket.on('error', function (error) {
          $log.error('socket: ' + error, error);

          if (error === 'handshake unauthorized') {
            $log.warn('the transmitted session no longer exists, trigger $sessionInactive event.');
            $rootScope.$emit('$sessionInactive');
          }

          $rootScope.socketEnabled = false;
        });
      };

      // check useSocket
      if (config.useSocket) {
        // create socket instance
        socketConnection = $bbcSocket.createSocket(config.host, config.connectTimeout);
        socket = socketConnection.socket;

        // register events
        registerSocketEvents(socket);
      }

      /**
       * @ngdoc method
       * @name bbc.transport.$bbcTransport#rest
       * @methodOf bbc.transport.$bbcTransport
       *
       * @description
       * Emit transport fire event to request post to server.
       * Rest route is event name.
       *
       * @param {!string} event - The rest event route.
       * @param {!(object|function(error, data) )} data - The data object for server.
       * @param {function(error, data) } callback - The callback.
       */
      pub.rest = function (event, data, callback) {
        // when 2nd param is callback, rewrite this
        if (arguments.length === 2) {
          callback = data;
          data = {};
        }

        // check event
        if (typeof event !== 'string' || event.length === 0) {
          throw new TypeError('Param "event" is required and must be of type string!');
        }

        // check data
        if (typeof data !== 'object') {
          throw new TypeError('Param "data" parameter must be of type object!');
        }

        // check callback
        if (typeof callback !== 'function') {
          throw new TypeError('Param "callback" is required and must be of type function!');
        }

        $rootScope.isLoading = true;

        $http.post(event, data)
          .success(function (result) {

            if (typeof result !== 'object') {
              result = JSON.parse(result);
            }

            $rootScope.isLoading = false;
            callback(null, result);
          })
          .error(function (data, status, headers, config) {
            $rootScope.isLoading = false;

            var error = {};

            if (typeof data !== 'object') {
              error = new Error(JSON.parse(data));
            }
            else {
              error = data;
            }

            error.restError = {
              status: status,
              headers: headers,
              config: config
            };

            callback(error, null);
          });
      };

      /**
       * @ngdoc method
       * @name bbc.transport.$bbcTransport#emit
       * @methodOf bbc.transport.$bbcTransport
       *
       * @description
       * Emit transport fire event to socket or request post to server.
       * Rest route is socket event name.
       *
       * @param {!string} event - The socket and rest event route.
       * @param {!(object|function(error, data) )} data - The data object for server.
       * @param {function=} callback - The callback.
       */
      pub.emit = function (event, data, callback) {

        // when 2nd param is callback, rewrite this
        if (arguments.length === 2) {
          callback = data;
          data = {};
        }

        // check event
        if (typeof event !== 'string' || event.length === 0) {
          throw new TypeError('Param "event" is required and must be of type string!');
        }

        // check data
        if (typeof data !== 'object') {
          throw new TypeError('Param "data" parameter must be of type object!');
        }

        // check callback
        if (typeof callback !== 'function') {
          throw new TypeError('Param "callback" is required and must be of type function!');
        }

        $rootScope.isLoading = true;

        // check if socket enabled
        if (config.useSocket && $rootScope.socketEnabled) {

          var socketTimedOut = false;

          // timeout for socket emit
          var promise = $timeout(function () {
            socketTimedOut = true;
            $rootScope.socketEnabled = false;
            socketConnection.connection.socket.disconnect();

            // emit again via rest
            pub.rest(event, data, callback);

            // try reconnect
            socketConnection.connection.socket.connect();

          }, config.socketResponseTimeout);

          socket.emit(event, data, function(error, result) {

            if (socketTimedOut) {
              socketTimedOut = false;
              return;
            }

            $timeout.cancel(promise);
            $rootScope.isLoading = false;

            callback(error, result);
          });
        }
        else {
          // use rest for transport
          pub.rest(event, data, callback);
        }
      };

      /**
       * @ngdoc method
       * @name bbc.transport.$bbcTransport#forward
       * @methodOf bbc.transport.$bbcTransport
       *
       * @description
       * Forwards an event to a scope
       *
       * @param {string} event The event to listen to
       * @param {object} scope The scope to forward the events to
       */
      pub.forward = function (event, scope) {
        if (config.useSocket) {
          socket.forward(event, scope);
        }
      };

      /**
       * @ngdoc method
       * @name bbc.transport.$bbcTransport#on
       * @methodOf bbc.transport.$bbcTransport
       *
       * @description
       * Register an event on the socket
       *
       * @param {string} event The event to listen to
       * @param {function(error, data) } callback The function to be called after event is raised
       */
      pub.on = function (event, callback) {
        if (config.useSocket) {
          socket.on(event, callback);
        }
      };

      /**
       * @ngdoc method
       * @name bbc.transport.$bbcTransport#addListener
       * @methodOf bbc.transport.$bbcTransport
       *
       * @description
       * Adds a listener on the socket
       * The same as on.
       *
       * @param {string} event The event to listen to
       * @param {function(error, data) } callback The function to be called after the event is raised
       */
      pub.addListener = function (event, callback) {
        if (config.useSocket) {
          socket.addListener(event, callback);
        }
      };

      /**
       * @ngdoc method
       * @name bbc.transport.$bbcTransport#removeListener
       * @methodOf bbc.transport.$bbcTransport
       *
       * @description
       * Removes a listener from the socket
       * The same as on.
       *
       * @param {string} event The event to listen to
       * @param {function(error, data) } callback The function to be called after event is removed from socket
       */
      pub.removeListener = function (event, callback) {
        if (config.useSocket) {
          socket.removeListener(event, callback);
        }
      };

      return pub;
    };
  });
