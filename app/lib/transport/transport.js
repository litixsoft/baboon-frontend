'use strict';

angular.module('lx.transport', ['btford.socket-io'])
  .provider('$socket', function () {

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
    this.$get = function (socketFactory, $log) {

      var factory = function () {
        var connection = io.connect(_host, _options);
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

        return socket;
      };

      return {
        factory:factory
      }
    };
  })
  .provider('$lxTransport', function ($socketProvider) {

    var _options;
    var _host;

    /**
     * Checks if a host is specified in the route.
     *
     * @param route
     * @returns {boolean}
     */
    var checkNewHttpRoute = function (route) {

      var check = false;

      if (route.indexOf('http://') !== -1) {
        check = true;
      }

      if (route.indexOf('https://') !== -1) {
        check = true;
      }

      return check;
    };

    var getRestUrl = function (route, data, isNewRoute) {
      var url;

      if (data.request && data.request.params) {
        for (var prop in data.request.params) {
          if (data.request.params.hasOwnProperty(prop)) {
            route = route.replace(':' + prop, data.request.params[prop])
          }
        }
      }

      if (isNewRoute) {
        url = route;
      } else {
        url = _host + route;
      }

      return url;
    };

    var createDataObject = function (req_params, req_body) {
      return {
        request: {
          params: req_params,
          body: req_body
        }
      };
    };

    /**
     * Provider config service
     * @param options
     */
    this.set = function (host, options) {

      // Set options
      options = options || {};

      // Extra handling for boolean options
      if (!options.hasOwnProperty('socketEnabled')) {
        options.socketEnabled = true;
      }

      options.socketHost = options.socketHost || host;
      options.socketConnectOptions = options.socketConnectOptions || {};
      options.socketEmitTimeout = options.socketEmitTimeout || 5000;

      try {

        // Check host
        if (typeof host !== 'string' || host.length === 0) {
          throw new TypeError('Parameter host is missing or is not of type string.');
        }

        // Check socket
        if (typeof options.socketEnabled !== 'boolean') {
          throw new TypeError('Parameter options.socketEnabled is not of type boolean.');
        }

        // Check socketHost
        if (typeof options.socketHost !== 'string' || options.socketHost.length === 0) {
          throw new TypeError('Parameter options.socketHost is not of type string.');
        }

        // Check socketConnectOptions
        if (typeof options.socketConnectOptions !== 'object') {
          throw new TypeError('Parameter options.socketConnectOptions is not of type object.');
        }

        // Check socketEmitTimeout
        if (typeof options.socketEmitTimeout !== 'number') {
          throw new TypeError('Parameter options.socketEmitTimeout is not of type number.');
        }
      }
      catch(e) {
        e.message += ' (caused by $lxTransportProvider.set)';
        console.error(e.message);
        console.error(e.stack);
        throw e;
      }

      // Activate socket when option is set
      if (options.socketEnabled) {
        $socketProvider.set(options.socketHost, options.socketConnectOptions);
      }

      _options = options;
      _host = host;
    };

    /**
     * Provider Transport get service
     * @param $http
     * @param $socket
     * @param $log
     * @returns {{}}
     */
    this.$get = function ($http, $socket, $log, $timeout, $q) {

      // Service return object
      var self = {};
      var socket;

      if (_options.socketEnabled) {
        socket = $socket.factory();
      }

      /**
       *
       * @param {string} eventName - Name for socket event (route)
       * @param {object} [data] -  Request data to server
       * @returns {{object}}
       */
      self.emit = function (eventName, data) {

        // Check eventName
        if (!eventName || typeof eventName !== 'string') {
          throw new TypeError('Parameter eventName is missing or is not of type string.');
        }

        // Set data
        data = data || {};

        // Check data
        if (data && typeof data !== 'object') {
          throw new TypeError('Parameter data is not of type object.');
        }

        // Set return object for emit
        var self = {};

        // Set options object for parameters
        var options = {};
        options.isSocketTimeoutSet = false;

        /**
         * @ngdoc method
         * @name $lxTransport.emit#timeout
         * @methodOf $lxTransport.emit
         *
         * @description
         * Set timeout for socket emit.
         * If no number for timeout passed, the $lxTransport.options.emitTimeout is used.
         * The $lxTransport.options.emitTimeout option is set by the provider config.
         *
         * @example
         * $lxTransport.emit(url, [data])
         *   .timeout([number])
         *
         * @param {number} [timeout=$lxTransport.options.emitTimeout] - Timeout for emit
         * @returns {object} $lxTransport.emit - The fluent API emit object
         */
        self.timeout = function (timeout) {

          options.isSocketTimeoutSet = true;
          timeout = timeout || null;

          // Check timeout
          if (timeout && typeof timeout !== 'number') {
            throw new TypeError('Parameter timeout is not of type number.');
          }

          // Set timeout to options
          if (timeout) {
            options.socketEmitTimeout = timeout;
          } else {
            options.socketEmitTimeout = _options.socketEmitTimeout;
          }

          return self;
        };

        /**
         * @ngdoc method
         * @name $lxTransport.emit#success
         * @methodOf $lxTransport.emit
         *
         * @description
         * Success callback function for emit
         * This function start the emit functionality
         *
         * @param {function} fnSuccess - Success callback
         * @returns {promise} promise - Promise object
         */
        self.success = function (fnSuccess) {

          var deferred = $q.defer();
          var promise = deferred.promise;

          // Check success callback
          if (!fnSuccess || typeof fnSuccess !== 'function') {
            throw new TypeError('Parameter success  is missing or is not of type function.');
          }

          // Request to server
          if (_options.socketEnabled && socket.connection.connected) {
            // Use socket emit for request

            // Set timeout for request
            if (options.isSocketTimeoutSet) {

            }

            socket.emit(eventName, data, function (err, res) {

              // Check if error and callback the results
              if (err) {
                $log.error('Failed to load resource: the server responded with a status of ' + err.status);
                deferred.reject(err);
              } else {
                fnSuccess(res);
              }
            });
          } else {
            // Socket is not available
            console.log('Socket is not available');
          }

          /**
           * @ngdoc method
           * @name $lxTransport.emit.success#error
           * @methodOf $lxTransport.emit.success
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

          return promise;
        };

        return self;
      };

      return self;
    }
  });



// Return object
//var self = {};

///**
// * REST API
// * @param url
// * @returns {{}}
// */
//self.rest = function () {
//
//  // Options for rest request
//  var options = {};
//
//  /**
//   * Check url type and if url includes a host
//   * Set url to options
//   * @param url
//   */
//  var checkUrl = function (url) {
//
//    // Check url type
//    if (typeof url !== 'string') {
//      throw new TypeError('Parameter url is missing or is not of type string.');
//    }
//
//    // Check if url includes a host
//    if (checkNewHttpRoute(url)) {
//      // Route includes host, use this host
//      options.url = url;
//    } else {
//      // Route does not contain a host, use standard host
//      options.url = _host + url;
//    }
//  };
//
//  // Return object
//  var self = {};
//
//  /**
//   * GET method
//   * @param url
//   * @returns {{}}
//   */
//  self.get = function (url) {
//    checkUrl(url);
//    options.method = 'GET';
//    return self;
//  };
//
//  /**
//   * HEAD method
//   * @param url
//   * @returns {{}}
//   */
//  self.head = function (url) {
//    checkUrl(url);
//    options.method = 'HEAD';
//    return self;
//  };
//
//  /**
//   * POST method
//   * @param url
//   * @param data
//   * @returns {{}}
//   */
//  self.post = function (url, data) {
//    checkUrl(url);
//    data = data || {};
//
//    // Check data param
//    if (typeof data !== 'object') {
//      throw new TypeError('Parameter data is not of type object.');
//    }
//
//    // Set param data and method
//    options.data = data;
//    options.method = 'POST';
//
//    return self;
//  };
//
//  /**
//   * PUT method
//   * @param url
//   * @param data
//   * @returns {{}}
//   */
//  self.put = function (url, data) {
//    checkUrl(url);
//    data = data || {};
//
//    // Check data param
//    if (typeof data !== 'object') {
//      throw new TypeError('Parameter data is not of type object.');
//    }
//
//    // Set param data and method
//    options.data = data;
//    options.method = 'PUT';
//
//    return self;
//  };
//
//  /**
//   * DELETE method
//   * @param url
//   * @returns {{}}
//   */
//  self.delete = function (url) {
//    checkUrl(url);
//    options.method = 'DELETE';
//    return self;
//  };
//
//  /**
//   * JSONP method
//   * @param url
//   * @returns {{}}
//   */
//  self.jsonp = function (url) {
//    checkUrl(url);
//    options.method = 'JSONP';
//    return self;
//  };
//
//  /**
//   * PATCH method
//   * @param url
//   * @param data
//   * @returns {{}}
//   */
//  self.patch = function (url, data) {
//    checkUrl(url);
//    data = data || {};
//
//    // Check data param
//    if (typeof data !== 'object') {
//      throw new TypeError('Parameter data is not of type object.');
//    }
//
//    // Set param data and method
//    options.data = data;
//    options.method = 'PATCH';
//    return self;
//  };
//
//  /**
//   * Set timeout for request
//   * @param timeout
//   * @returns {{}}
//   */
//  self.timeout = function (timeout) {
//
//    if (!timeout) {
//      // No param set default timeout
//      options.timeout = _options.restTimeoutDefault;
//    } else {
//      // Check timeout param
//      if (typeof timeout !== 'number') {
//        throw new TypeError('Parameter timeout is not of type number.(5000 for 5sec)');
//      }
//
//      // Set param timeout
//      options.timeout = timeout;
//    }
//
//    return self;
//  };
//
//  /**
//   * Set params for request
//   * @param params
//   * @returns {{}}
//   */
//  self.params = function (params) {
//
//    // Check params
//    if (!params || typeof params !== 'object') {
//      throw new TypeError('Parameter params is missing or is not of type object.');
//    }
//
//    options.params = params;
//    return self;
//  };
//
//  /**
//   * Set headers for request
//   * @param headers
//   * @returns {{}}
//   */
//  self.headers = function (headers) {
//
//    // Check headers
//    if (!headers || typeof headers !== 'object') {
//      throw new TypeError('Parameter headers is missing or is not of type object.');
//    }
//
//    options.headers = headers;
//    return self;
//  };
//
//  /**
//   * Future callback method
//   * @param {function} success
//   * @param {function} error
//   * @returns {{}}
//   */
//  self.then = function (success, error) {
//
//    // Check success callback
//    if (!success || typeof success !== 'function') {
//      throw new TypeError('Parameter success  is missing or is not of type function.');
//    }
//
//    // Check options.method
//    if (!options.method) {
//      throw new TypeError('Parameter method(url) is not specified.');
//    }
//
//    // Angular rest service
//    $http(options).
//      success(function (data, status, headers, config) {
//        // this callback will be called asynchronously
//        // when the response is available
//        success(data, status, headers, config);
//      }).
//      error(function (data, status, headers, config) {
//        // called asynchronously if an error occurs
//        // or server returns response with an error status.
//        if (error) {
//          error(data, status, headers, config);
//        }
//      });
//  };
//
//  return self;
//};

/**
 * Emit message to server
 * @param eventName
 * @param data
 * @returns {*}
 */
//      self.emit = function (eventName, data) {
//
//        data = data || {};
//
//        var options = {};
//
//        var deferred = $q.defer();
//        var promise = deferred.promise;
//
//        var timeoutPromise = null;
//
//        // Timeout for socket emit
//        $timeout(function () {
//          console.log(options.socketTimeout);
//          if (options.socketTimeout) {
//            console.log('start timeout');
//            timeoutPromise = $timeout(function () {
//              console.log('timeout fired');
//              deferred.reject(new Error('Socket emit timeout: ' + options.socketTimeout));
//              //socketTimedOut = true;
//
////          $rootScope.socketEnabled = false;
//
//
//              // emit again via rest
////          pub.rest(event, data, callback);
//
//              // try reconnect
////          socketConnection.connection.socket.connect();
//
//            }, options.socketTimeout);
//          }
//
//          console.log('start socket emit');
//          $socket.emit(eventName, data, function (err, res) {
//            if (err) {
//              $log.error('Failed to load resource: the server responded with a status of ' + err.status);
//              deferred.reject(err);
//            } else {
//
//              //if (socketTimedOut) {
//              //  socketTimedOut = false;
//              //  return;
//              //}
//
//              // When timeoutPromise is available then cancel timeout
//              if (timeoutPromise) {
//                $timeout.cancel(timeoutPromise);
//              }
//
////            $rootScope.isLoading = false;
//              deferred.resolve(res);
//            }
//          });
//
//        },0);
//
//
//
//
//
//        /**
//         * @description
//         * Use REST when socket not enabled or disconnected
//         *
//         * @param method
//         * @returns {*}
//         */
//        promise.rest = function (method) {
//          promise.then(function () {
//            console.log('restMethod', method);
//          });
//          return promise;
//        };
//
//        promise.params = function (params) {
//          promise.then(function () {
//            console.log('params', params);
//          });
//          return promise;
//        };
//
//        promise.header = function (header) {
//          promise.then(function () {
//            console.log('header', header);
//          });
//          return promise;
//        };
//
//        /**
//         * @ngdoc method
//         * @name lxTransport.emit#timeout
//         * @methodOf lxTransport.alert.emit
//         *
//         * @description
//         * Set timeout for socket emit
//         *
//         * @param {number} [timeout] - Timeout for emit
//         *
//         * @example
//         * $lxTransport.emit(url, data)
//         *   .timeout(number)
//         *
//         * @returns {*}
//         */
//        promise.timeout = function (timeout) {
//          promise.then(function () {
//            timeout = timeout || null;
//
//            // Check timeout
//            if (timeout && typeof timeout !== 'number') {
//              throw new TypeError('Parameter timeout is not of type number.');
//            }
//            // Set timeout to options
//            if (timeout) {
//              options.socketTimeout = timeout;
//            }
//          });
//          return promise;
//        };
//
//        /**
//         * Retry rest if timeout
//         * @param retry
//         * @returns {*}
//         */
//        promise.retry = function (retry) {
//          promise.then(function () {
//            retry = retry || false;
//
//            // Check retry
//            if (typeof retry !== 'boolean') {
//              throw new TypeError('Parameter retry is not of type boolean.');
//            }
//
//            // Set in options
//            options.retry = retry;
//
//          });
//          return promise;
//        };
//
//        promise.success = function (fn) {
//          promise.then(fn);
//          return promise;
//        };
//
//        promise.error = function (fn) {
//          promise.then(null, fn);
//          return promise;
//        };
//
//        // Promise object
//        return promise;
//      };


//self.socket = function (route, timeout) {
//
//  // Check route
//  if (typeof route !== 'string') {
//    throw new TypeError('Param "route" required and must be of type string!');
//  }
//
//  // Fluent vars
//  var socketTimeout = timeout || 5000;
//  var restTimeout;
//  var requestParams;
//  var requestBody;
//  var requestHeader;
//  var retryRest;
//  var successCallback;
//  var errorCallback;
//
//  var self = {};
//
//  self.setRequestParams = function (params) {
//    console.log('setRequestParams:', params);
//    return self;
//  };
//
//  self.setRequestBody = function (params) {
//    console.log('setRequestBody:', params);
//    return self;
//  };
//
//  self.setRequestHeader = function (params) {
//    console.log('setRequestHeader:', params);
//    return self;
//  };
//
//  self.retryRest = function (method, timeout) {
//    console.log('retryRest method: %s timeout %s:', method, timeout);
//    restTimeout = timeout;
//    return self;
//  };
//
//  self.then = function (cb) {
//
//    var error;
//
//    $timeout(function () {
//      console.log('Timeout in the is over');
//      if (route ='/users') {
//        console.log('##success##');
//        return cb('On Success');
//      } else {
//        console.log('##error##');
//      }
//    }, socketTimeout);
//
//    return {
//      error: function (cb) {
//        if (error)
//        return cb('On Error');
//      }
//    }
//  };
//
//  return self;
//};

//var self = {};
//
//self.get = function (route, options, cb) {
//
//  // Check parameters
//  if (arguments.length < 2) {
//    throw new Error('Missing Parameters: parameter "route" and "callback" are required!');
//  }
//
//  // Check route
//  if (typeof route !== 'string') {
//    throw new TypeError('Param "route" required and must be of type string!');
//  }
//
//  // Check callback
//  if (typeof arguments[(arguments.length - 1)] !== 'function') {
//    throw new TypeError('Param "callback" must be of type function!');
//  }
//
//  // Set options
//  options = options || {};
//  options.req_params = options.req_params || {};
//  options.req_body = options.req_body || {};
//  options.timeout = options.timeout || 5000;
//  options.rest = options.rest || false;
//  options.isNewRoute = checkNewHttpRoute(route);
//  options.socketEnabled = _options.socketEnabled;
//  options.socketDisconnected = $socket.connection.disconnected;
//
//  // Check options
//  if (typeof options.req_params !== 'object') {
//    throw new TypeError('Param "options.data" must be of type object!');
//  }
//  if (typeof options.req_body !== 'object') {
//    throw new TypeError('Param "options.data" must be of type object!');
//  }
//  if (typeof options.timeout !== 'number') {
//    throw new TypeError('Param "options.timeout" must be of type number!');
//  }
//  if (typeof options.rest !== 'boolean') {
//    throw new TypeError('Param "options.rest" must be of type boolean!');
//  }
//
//  // Create data object
//  options.data = createDataObject(options.req_params, options.req_body);
//
//  // Check should be used rest
//  if (!options.socketEnabled || options.socketDisconnected || options.isNewRoute || options.rest) {
//
//    // Use rest for transport
//
//    // create url
//    var url = getRestUrl(route, options.data, options.isNewRoute);
//
//    // Use rest for transport
//    $log.info('transport: $http.get(\'%s\')', url);
//
//    $http.get(url)
//      .success(function (data) {
//        cb(null, data);
//      })
//      .error(function (data) {
//        cb(data);
//      });
//  } else {
//
//    // Use socket for transport
//    $log.info('transport: $socket.emit(\'%s\')', route);
//
//    $socket.emit(route, options.data, function (err, res) {
//      if (err) {
//        $log.error('Failed to load resource: the server responded with a status of ' + err.status);
//        cb(err.message);
//      } else {
//        cb(null, res);
//      }
//    });
//  }
//};
//
//return self;
//  };
//});
//.provider('$socket', function (socketFactory) {
//
//  var _host, _options;
//
//  var createSocket = function (host, options) {
//    var connection = io.connect(_host, _options);
//    var engine = connection.io.engine;
//
//    connection.on('connect', function () {
//      $log.info('socket connected with:', engine.transport.query.transport);
//    });
//
//    // Connect event after upgrade to websocket
//    connection.on('upgrade', function (msg) {
//      $log.info('socket upgrade connection to:', msg.query.transport);
//    });
//
//    return {
//      socket: socketFactory({
//        // Creates a new socket connection.
//        ioSocket: connection
//      }),
//      connection: connection,
//      engine: engine
//    };
//  };
//
//  this.set = function (host, options) {
//
//    // check host
//    if (typeof host !== 'string' || host.length === 0) {
//      throw new TypeError('Param "host" is required and must be of type string!');
//    }
//
//    _host = host;
//
//    _options = options || {};
//    _options.reconnection = options.reconnection || true;
//    _options.reconnectionDelay = options.reconnectionDelay || 1000;
//    _options.reconnectionDelayMax = options.reconnectionDelayMax || 5000;
//    _options.timeout = options.timeout || 5000;
//    _options.connect_timeout = options.connect_timeout || 20000;
//
//  };
//
//  this.$get = function ($rootScope, SocketIo, $log) {
//
//    // create socket instance
//    var socketIo = SocketIo.createSocket(_host, _options);
//
//    var socket = socketIo.socket;
//    //var connection = socketIo.connection;
//    //var engine = socketIo.engine;
//
//    return socket;
//  };
//});

///**
// * @ngdoc object
// * @name bbc.transport.$bbcTransport
// * @requires $timeout
// *
// * @description
// * Service for transport. It can either use a socket connection or a rest connection. The option which communication
// * to use is useSocket.
// *
// * For more information look at the [guide](/transport).
// *
// */
//.provider('$lxTransport', function () {
//  var config = {};
//
//  /**
//   * @ngdoc method
//   * @name bbc.transport.$bbcTransport#set
//   * @methodOf bbc.transport.$bbcTransport
//   *
//   * @description
//   * Setup the transport configuration
//   *
//   * @param {object} options The options for config
//   */
//  this.set = function (options) {
//    options = options || {};
//
//    // default settings
//    config.protocol = options.protocol;
//    config.hostname = options.hostname;
//    config.port = options.port;
//
//    if (options.hasOwnProperty('useSocket')) {
//      config.useSocket = options.useSocket;
//    } else {
//      config.useSocket = true;
//    }
//
//    config.connectTimeout = options.connectTimeout || 5000;
//    config.socketResponseTimeout = options.socketResponseTimeout || 5000;
//  };
//
//  this.$get = function ($rootScope, $http, $bbcSocket, $window, $log, $timeout) {
//    var pub = {};
//
//    var socket;
//    var socketConnection;
//
//    // default settings when options is empty
//    config.protocol = config.protocol || $window.location.protocol;
//    config.hostname = config.hostname || $window.location.hostname;
//    config.port = config.port || parseInt($window.location.port);
//
//    // fix protocol when forgotten :
//    if (config.protocol === 'http' || config.protocol === 'https' ||
//      config.protocol === 'ws' || config.protocol === 'wss') {
//      config.protocol = config.protocol + ':';
//    }
//
//    if (!config.port || config.port === 443 || config.port === 80) {
//
//      // create the host url without port
//      config.host = config.protocol + '//' + config.hostname;
//    }
//    else {
//
//      // create the host url with port
//      config.host = config.protocol + '//' + config.hostname + ':' + config.port;
//    }
//
//    // default socket is not enabled
//    $rootScope.socketEnabled = false;
//
//    /**
//     * Register socket events
//     *
//     * @param socket
//     */
//    var registerSocketEvents = function (socket) {
//      // socket connect event, change transportSocket to true.
//      socket.on('connecting', function () {
//        $log.info('socket: connecting to ', config.host);
//      });
//
//      // socket connect event, change transportSocket to true.
//      socket.on('connect', function () {
//        $log.info('socket: connected');
//        $rootScope.socketEnabled = true;
//      });
//
//      // socket disconnect event, change transportSocket to false.
//      socket.on('disconnect', function () {
//        $log.warn('socket: disconnected');
//        $rootScope.socketEnabled = false;
//      });
//
//      // socket error event
//      socket.on('error', function (error) {
//        $log.error('socket: ' + error, error);
//
//        if (error === 'handshake unauthorized') {
//          $log.warn('the transmitted session no longer exists, trigger $sessionInactive event.');
//          $rootScope.$emit('$sessionInactive');
//        }
//
//        $rootScope.socketEnabled = false;
//      });
//    };
//
//    // check useSocket
//    if (config.useSocket) {
//      // create socket instance
//      socketConnection = $bbcSocket.createSocket(config.host, config.connectTimeout);
//      socket = socketConnection.socket;
//
//      // register events
//      registerSocketEvents(socket);
//    }
//
//    /**
//     * @ngdoc method
//     * @name bbc.transport.$bbcTransport#rest
//     * @methodOf bbc.transport.$bbcTransport
//     *
//     * @description
//     * Emit transport fire event to request post to server.
//     * Rest route is event name.
//     *
//     * @param {!string} event - The rest event route.
//     * @param {!(object|function(error, data) )} data - The data object for server.
//     * @param {function(error, data) } callback - The callback.
//     */
//    pub.rest = function (event, data, callback) {
//      // when 2nd param is callback, rewrite this
//      if (arguments.length === 2) {
//        callback = data;
//        data = {};
//      }
//
//      // check event
//      if (typeof event !== 'string' || event.length === 0) {
//        throw new TypeError('Param "event" is required and must be of type string!');
//      }
//
//      // check data
//      if (typeof data !== 'object') {
//        throw new TypeError('Param "data" parameter must be of type object!');
//      }
//
//      // check callback
//      if (typeof callback !== 'function') {
//        throw new TypeError('Param "callback" is required and must be of type function!');
//      }
//
//      $rootScope.isLoading = true;
//
//      $http.post(event, data)
//        .success(function (result) {
//
//          if (typeof result !== 'object') {
//            result = JSON.parse(result);
//          }
//
//          $rootScope.isLoading = false;
//          callback(null, result);
//        })
//        .error(function (data, status, headers, config) {
//          $rootScope.isLoading = false;
//
//          var error = {};
//
//          if (typeof data !== 'object') {
//            error = new Error(JSON.parse(data));
//          }
//          else {
//            error = data;
//          }
//
//          error.restError = {
//            status: status,
//            headers: headers,
//            config: config
//          };
//
//          callback(error, null);
//        });
//    };
//
//    /**
//     * @ngdoc method
//     * @name bbc.transport.$bbcTransport#emit
//     * @methodOf bbc.transport.$bbcTransport
//     *
//     * @description
//     * Emit transport fire event to socket or request post to server.
//     * Rest route is socket event name.
//     *
//     * @param {!string} event - The socket and rest event route.
//     * @param {!(object|function(error, data) )} data - The data object for server.
//     * @param {function=} callback - The callback.
//     */
//    pub.emit = function (event, data, callback) {
//
//      // when 2nd param is callback, rewrite this
//      if (arguments.length === 2) {
//        callback = data;
//        data = {};
//      }
//
//      // check event
//      if (typeof event !== 'string' || event.length === 0) {
//        throw new TypeError('Param "event" is required and must be of type string!');
//      }
//
//      // check data
//      if (typeof data !== 'object') {
//        throw new TypeError('Param "data" parameter must be of type object!');
//      }
//
//      // check callback
//      if (typeof callback !== 'function') {
//        throw new TypeError('Param "callback" is required and must be of type function!');
//      }
//
//      $rootScope.isLoading = true;
//
//      // check if socket enabled
//      if (config.useSocket && $rootScope.socketEnabled) {
//
//        var socketTimedOut = false;
//
//        // timeout for socket emit
//        var promise = $timeout(function () {
//          socketTimedOut = true;
//          $rootScope.socketEnabled = false;
//          socketConnection.connection.socket.disconnect();
//
//          // emit again via rest
//          pub.rest(event, data, callback);
//
//          // try reconnect
//          socketConnection.connection.socket.connect();
//
//        }, config.socketResponseTimeout);
//
//        socket.emit(event, data, function(error, result) {
//
//          if (socketTimedOut) {
//            socketTimedOut = false;
//            return;
//          }
//
//          $timeout.cancel(promise);
//          $rootScope.isLoading = false;
//
//          callback(error, result);
//        });
//      }
//      else {
//        // use rest for transport
//        pub.rest(event, data, callback);
//      }
//    };
//
//    /**
//     * @ngdoc method
//     * @name bbc.transport.$bbcTransport#forward
//     * @methodOf bbc.transport.$bbcTransport
//     *
//     * @description
//     * Forwards an event to a scope
//     *
//     * @param {string} event The event to listen to
//     * @param {object} scope The scope to forward the events to
//     */
//    pub.forward = function (event, scope) {
//      if (config.useSocket) {
//        socket.forward(event, scope);
//      }
//    };
//
//    /**
//     * @ngdoc method
//     * @name bbc.transport.$bbcTransport#on
//     * @methodOf bbc.transport.$bbcTransport
//     *
//     * @description
//     * Register an event on the socket
//     *
//     * @param {string} event The event to listen to
//     * @param {function(error, data) } callback The function to be called after event is raised
//     */
//    pub.on = function (event, callback) {
//      if (config.useSocket) {
//        socket.on(event, callback);
//      }
//    };
//
//    /**
//     * @ngdoc method
//     * @name bbc.transport.$bbcTransport#addListener
//     * @methodOf bbc.transport.$bbcTransport
//     *
//     * @description
//     * Adds a listener on the socket
//     * The same as on.
//     *
//     * @param {string} event The event to listen to
//     * @param {function(error, data) } callback The function to be called after the event is raised
//     */
//    pub.addListener = function (event, callback) {
//      if (config.useSocket) {
//        socket.addListener(event, callback);
//      }
//    };
//
//    /**
//     * @ngdoc method
//     * @name bbc.transport.$bbcTransport#removeListener
//     * @methodOf bbc.transport.$bbcTransport
//     *
//     * @description
//     * Removes a listener from the socket
//     * The same as on.
//     *
//     * @param {string} event The event to listen to
//     * @param {function(error, data) } callback The function to be called after event is removed from socket
//     */
//    pub.removeListener = function (event, callback) {
//      if (config.useSocket) {
//        socket.removeListener(event, callback);
//      }
//    };
//
//    return pub;
//  };
//});
