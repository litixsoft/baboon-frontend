'use strict';

/**
 * @ngdoc overview
 * @name lx.socket
 */
angular.module('lx.socket', ['btford.socket-io'])
  .provider('$lxSocket', function () {

    var _host, _options;

    /**
     * @ngdoc service
     * @name lx.socket.$lxSocket#set
     * @methodOf lx.socket.$lxSocket
     *
     * @description
     * Set the host and connection options for socket
     *
     * @param {string} host The host for socket
     * @param {object=} options The options for socket connect
     * @param {boolean=} options.reconnection = true - Whether to reconnect automatically
     * @param {number=} options.reconnectionDelay = 1000 - How long to wait before attempting a new reconnection
     * @param {number=} options.reconnectionDelayMax = 20000 - Maximum amount of time to wait between reconnections.
     * Each attempt increases the reconnection by the amount specified by reconnectionDelay
     * @param {number=} options.timeout = 5000 - Connection timeout before a connect_error and
     * connect_timeout events are emitted
     * @param {number=} options.reconnectionAttempts = 100 - Maximum number of reconnection attempts
     * @throws {TypeError} Error when wrong type by options
     */
    this.set = function (host, options) {

      // Set options
      options = options || {};

      // Extra handling for boolean options
      if (!options.hasOwnProperty('reconnection')) {
        options.reconnection = true;
      }

      options.reconnectionDelay = options.reconnectionDelay || 1000;
      options.reconnectionDelayMax = options.reconnectionDelayMax || 20000;
      options.timeout = options.timeout || 5000;
      options.reconnectionAttempts = options.reconnectionAttempts || 100;

      try {
        // Check host
        if (typeof host !== 'string' || host.length === 0) {
          throw new TypeError('Parameter host is missing or is not of type string.');
        }

        // Check reconnection
        if (typeof options.reconnection !== 'boolean') {
          throw new TypeError('Parameter options.reconnection is not of type boolean.');
        }

        // Check reconnectionDelay
        if (typeof options.reconnectionDelay !== 'number') {
          throw new TypeError('Parameter options.reconnectionDelay is not of type number.');
        }

        // Check reconnectionDelayMax
        if (typeof options.reconnectionDelayMax !== 'number') {
          throw new TypeError('Parameter options.reconnectionDelayMax is not of type number.');
        }

        // Check timeout
        if (typeof options.timeout !== 'number') {
          throw new TypeError('Parameter options.timeout is not of type number.');
        }

        // Check reconnectionAttempts
        if (typeof options.reconnectionAttempts !== 'number') {
          throw new TypeError('Parameter options.reconnectionAttempts is not of type number.');
        }
      } catch (e) {
        e.message += ' (caused by $socketProvider.set)';
        console.error(e.message);
        console.error(e.stack);
        throw e;
      }

      _host = host;
      _options = options;
    };

    /**
     * @ngdoc service
     * @name lx.socket.$lxSocket
     * @requires btford.socket-io
     *
     * @description
     * Mapper for btford.socket-io with extended functionality.
     *
     * @param {object} $rootScope - The $rootScope
     * @param {function} socketFactory - The btford.socket-io factory
     * @param {function} $log - Angular $log service
     * @param {function} $timeout - Angular timeout service
     * @returns {object} $lxSocket - The $lxSocket object
     */
    this.$get = function ($rootScope, socketFactory, $log, $timeout) {

      // $get return object
      var self = {};

      // First use flag for emit loop
      var isFirstUse = true;

      // Factory creates a socket.io instance
      var socketIoFactory = function socketIoFactory() {

        // Socket connection
        var connection = io.connect(_host, _options);

        // Engine.io for upgrade event
        var engine = connection.io.engine;
        var socket;

        //btford socket factory
        socket = socketFactory({
          ioSocket: connection
        });

        // Connection to socket
        socket.connection = connection;

        socket.forward('connect');
        socket.forward('disconnect');

        // Connect event
        socket.on('connect', function () {
          $log.info('socket connected with:', engine.transport.query.transport);
          $rootScope.socketConnected = true;
        });

        engine.on('upgrade', function (msg) {
          $log.info('socket upgrade connection to:', msg.query.transport);
          $rootScope.socketWsUpgrade = true;
        });

        // Disconnect event
        socket.on('disconnect', function () {
          $log.info('socket disconnected');
          $rootScope.socketConnected = false;
          $rootScope.socketWsUpgrade = false;
        });


        return socket;
      };

      // Create Socket.io instance
      var socket = socketIoFactory();

      /**
       * @ngdoc method
       * @name lx.socket.$lxSocket#isConnected
       * @methodOf lx.socket.$lxSocket
       *
       * @description
       * Checks whether the socket is connected and supplies true or false
       *
       * @returns {boolean} socket.connection.connected
       */
      self.isConnected = function () {
        return socket.connection.connected;
      };

      /**
       * @ngdoc method
       * @name lx.socket.$lxSocket#transport
       * @methodOf lx.socket.$lxSocket
       *
       * @description
       * Displays the current transport of socket.
       *
       * @returns {string} transport - Actual transport (polling|websocket)
       */
      self.transport = function () {
        return socket.connection.io.engine.transport.query.transport;
      };

      /**
       * @ngdoc method
       * @name lx.socket.$lxSocket.#emit
       * @methodOf lx.socket.$lxSocket
       *
       * @description
       * Send event with or without callback to socket server.
       *
       * @param {string} eventName Name of server event
       * @param {object=} data Data for server
       * @param {function(err, success)=} callback Callback function
       * @param {function=} callback.err Error callback function
       * @param {function=} callback.success Success callback function
       * @throws {TypeError} Error when wrong type by eventName
       * @throws {Error} Error when socket not connected with status 405.
       *
       * @example
        With callback:
           <pre>
               $lxSocket.emit('name', function (err, success) {
                 if (err) {
                   console.log(err.status, err.message, err.stack);
                 } else {
                   console.log(success.status, success.data)
                 }
               });
           </pre>
        Without callback:
           <pre>
               $lxSocket.emit('name');
           </pre>
       */
      self.emit = function (eventName, data, callback) {

        // Check eventName
        if (typeof eventName !== 'string') {
          throw new TypeError('Parameter eventName  is missing or is not of type string.');
        }

        // Set data
        data = data || {};

        // Check data
        if (typeof data === 'function') {
          callback = data;
          data = {};
        }

        // Check data
        if (typeof data !== 'object') {
          throw new TypeError('Parameter data is not of type object.');
        }

        // Request to server when connected
        if (socket.connection.connected) {

          // Check if callback exists
          if (callback) {
            // Send message to server with callback
            return socket.emit(eventName, data, callback);
          } else {
            // Send emit message to server without callback
            return socket.emit(eventName, data);
          }
        } else {
          // Socket is not connected.
          // If socket.emit is used for the first time,
          // start loop and wait for connection.
          // Termination condition is the socket connect timeout option

          // Error function
          var error = function () {
            var err = new Error('Error: 405 Method Not Allowed, socket is not connected.');
            err.status = 405;
            throw err;
          };

          // When not first use return error
          if (!isFirstUse) {
            return error();
          }

          // Set first use flag to false
          isFirstUse = false;

          // Wait connect timeout
          var condition = false;

          // Connect timeout for termination condition
          $timeout(function() {
            condition = true;
          },_options.timeout);

          // Check connection status
          var loop = function (fn) {
            setTimeout(function () {
              if (socket.connection.connected || condition) {
                return fn();
              } else {
                loop(fn);
              }
            }, 100);
          };

          // Start loop for connection
          loop(function() {
            // Check if connected
            if (socket.connection.connected) {

              // Check if callback exists
              if (callback) {
                // Send message to server with callback
                return socket.emit(eventName, data, callback);
              } else {
                // Send emit message to server without callback
                return socket.emit(eventName, data);
              }
            } else {
              // Run error function
              return error();
            }
          });
        }
      };

      /**
       * @ngdoc method
       * @name lx.socket.$lxSocket#forward
       * @methodOf lx.socket.$lxSocket
       *
       * @description
       * Forwards an socket event to a scope
       *
       * @param {string} event - The event to listen to
       * @param {object} scope - The scope to forward the events to
       * @throws {TypeError} Error when wrong type by event or callback
       */
      self.forward = function (event, scope) {

        // Check event
        if (typeof event !== 'string') {
          throw new TypeError('Parameter event is not of type string.');
        }

        // Check callback
        if (scope && typeof scope !== 'object') {
          throw new TypeError('Parameter scope is not of type object.');
        }

        socket.forward(event, scope);
      };

      /**
       * @ngdoc method
       * @name lx.socket.$lxSocket#on
       * @methodOf lx.socket.$lxSocket
       *
       * @description
       * Register an event on the socket
       *
       * @param {string} event - The event to listen to
       * @param {function(data)} [callback] - Callback function
       * @param {function} [callback.data] - Data callback function
       * @param {function} [callback] - Callback function
       * @throws {TypeError} Error when wrong type by event or callback
       */
      self.on = function (event, callback) {

        // Check event
        if (typeof event !== 'string') {
          throw new TypeError('Parameter event is not of type string.');
        }

        // Check callback
        if (typeof callback !== 'function') {
          throw new TypeError('Parameter callback is not of type function.');
        }

        socket.on(event, callback);
      };

      /**
       * @ngdoc method
       * @name lx.socket.$lxSocket#addListener
       * @methodOf lx.socket.$lxSocket
       *
       * @description
       * Adds a listener on the socket
       * The same as on.
       *
       * @param {string} event The event to listen to
       * @param {function(data)=} callback Callback function
       * @param {function=} callback.data Data callback function to be called after the event is raised
       * @throws {TypeError} Error when wrong type by event or callback
       */
      self.addListener = function (event, callback) {

        // Check event
        if (typeof event !== 'string') {
          throw new TypeError('Parameter event is not of type string.');
        }

        // Check callback
        if (typeof callback !== 'function') {
          throw new TypeError('Parameter callback is not of type function.');
        }

        socket.addListener(event, callback);
      };

      /**
       * @ngdoc method
       * @name lx.socket.$lxSocket#removeListener
       * @methodOf lx.socket.$lxSocket
       *
       * @description
       * Removes a listener from the socket
       * The same as on.
       *
       * @param {string} event The event to listen to
       * @param {function(data)=} callback Callback function
       * @param {function=} callback.data Data callback function to be called after event is removed from socket
       * @throws {TypeError} Error when wrong type by event or callback
       */
      self.removeListener = function (event, callback) {

        // Check event
        if (typeof event !== 'string') {
          throw new TypeError('Parameter event is not of type string.');
        }

        // Check callback
        if (typeof callback !== 'function') {
          throw new TypeError('Parameter callback is not of type function.');
        }

        socket.removeListener(event, callback);
      };

      self.removeAllListeners = function (event, callback) {

        // Check event
        if (typeof event !== 'string') {
          throw new TypeError('Parameter event is not of type string.');
        }

        // Check callback
        if (typeof callback !== 'function') {
          throw new TypeError('Parameter callback is not of type function.');
        }

        socket.removeAllListeners(event, callback);
      };

      // $get return object
      return self;
    };
  });
