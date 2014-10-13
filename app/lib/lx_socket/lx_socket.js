'use strict';

/**
 *
 */
angular.module('lx.socket', ['btford.socket-io'])
  .provider('$lxSocket', function () {

    var _host;
    var _options = {};

    /**
     *
     * @param host
     * @param options
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
     *
     * @param socketFactory
     * @param $log
     * @returns {{factory: Function}}
     */
    this.$get = function ($rootScope, socketFactory, $log, $q, $timeout) {

      // $get
      var self = {};

      // Socket instances
      var instances = {};


      /**
       *
       * @returns {*}
       */
      var socketIoFactory = function () {

        if (instances.socketIo) {
          return instances.socketIo;
        }

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

        // Connect event
        socket.on('connect', function () {
          $log.info('socket connected with:', engine.transport.query.transport);
        });

        // Connect event after upgrade to websocket
        engine.on('upgrade', function (msg) {
          $log.info('socket upgrade connection to:', msg.query.transport);
        });

        // Disconnect event
        socket.on('disconnect', function () {
          $log.info('socket disconnected');
        });

        instances.socketIo = socket;

        return instances.socketIo;
      };

      /**
       *
       * @returns {{}}
       */
      self.getSocketIo = function () {

        // getSocketIo
        var self = {};

        // options for getSocketIo
        var options = {};
        options.emitTimeout = _options.timeout;

        // Socket instance
        var socket = socketIoFactory();


        self.emit = function (eventName, data) {

          // emit
          var self = {};

          /**
           * @ngdoc method
           * @name $lxSocket.getSocketIo.emit#timeout
           * @methodOf $lxSocket.getSocketIo.emit
           *
           * @description
           * Set timeout for socket emit.
           * If no number for timeout passed, the $lxSocket timeout option is used.
           * The $lxSocket timeout option is set by the provider config.
           *
           * @example
           * $lxSocket.emit(url, [data])
           *   .timeout([number])
           *
           * @param {number} [timeout=options.timeout] - Timeout for emit
           * @returns {object} $lxSocket.getSocketIo.emit - The fluent API emit object
           */
          self.timeout = function (timeout) {

            // Check timeout
            if (typeof timeout !== 'undefined') {

              if (typeof timeout !== 'number') {
                throw new TypeError('Parameter timeout is not of type number.');
              }

              // Set new timeout
              options.emitTimeout = timeout;
            }

            return self;
          };

          /**
           * @ngdoc method
           * @name $lxSocket.getSocketIo.emit#success
           * @methodOf $lxSocket.getSocketIo.emit
           *
           * @description
           * Success callback function for emit
           * This function start the emit functionality
           *
           * @param {function} fnSuccess - Success callback
           * @returns {promise} promise - Promise object
           */
          self.success = function (fnSuccess) {

            // Promise object
            var deferred = $q.defer();

            // success promise
            var promise = deferred.promise;

            // Check success callback
            if (!fnSuccess || typeof fnSuccess !== 'function') {
              throw new TypeError('Parameter success  is missing or is not of type function.');
            }

            // Request to server when connected
            if (socket.connection.connected) {

              $rootScope.isLoading = true;
              var socketTimedOut = false;
              var timeoutPromise;

              // Set timeout for request
              if (options.emitTimeout > 0) {

                // Start timeout for socket emit
                timeoutPromise = $timeout(function () {
                  socketTimedOut = true;
                  var err = new Error('504 Gateway Time-out: Socket emit has a timeout triggered');
                  err.status = 504;
                  $rootScope.isLoading = false;

                  // Call error callback
                  deferred.reject(err);

                }, options.emitTimeout);
              }

              // Send emit message to server
              socket.emit(eventName, data, function (err, res) {

                // When callback after timeout
                if (socketTimedOut) {
                  socketTimedOut = false;
                  return;
                }

                // Cancel timeout if it is enabled
                if (timeoutPromise) {
                  $timeout.cancel(timeoutPromise);
                }

                $rootScope.isLoading = false;

                // Check if error and callback the results
                if (err) {
                  deferred.reject(err);
                } else {
                  fnSuccess(res);
                }
              });
            } else {
              // Socket is not available
              var err = new Error('503 Service Unavailable: Socket is not available.');
              err.status = 503;
              deferred.reject(err);
            }

            /**
             * @ngdoc method
             * @name $lxSocket.getSocketIo.emit.success#error
             * @methodOf $lxSocket.getSocketIo.emit.success
             * @description
             * Error callback function for emit
             *
             * @param {function} fn - Error callback
             * @returns {promise} promise - Promise object
             */
            promise.error = function (fn) {
              promise.then(null, fn);
              return promise;
            };

            // success promise
            return promise;
          };

          // emit
          return self;
        };

        // getSocketIo
        return self;
      };

      // $get
      return self;
    }
  });
