'use strict';

/**
 * Rest echo server
 *
 * @param options
 * @param next
 */
module.exports = function (options, next) {

  // Check server parameter
  if (!options.router) {
    throw new Error('Parameter options.router required');
  }

  var router = options.router;
  var debug = require('debug')('baboon:rest');
  debug('Create rest echo server');

  // Middleware for all api requests
  router.all('/*', function (req, res) {

    var data = req.body || {data: 'empty'};

    debug('/api: receive request with path: %s from client', req.url);
    debug(data);

    res.set('Content-Type', 'application/json');
    res.status(200).json({data: data});
  });

  next();
};
