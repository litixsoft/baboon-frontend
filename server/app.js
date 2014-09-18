var fs = require('fs');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

/**
 *
 * @param options
 */
module.exports = function(options) {

  var config = options.config;

  if (! config) {
    throw new Error('Parameter Error: config required');
  }

  const ROOT_PATH = config.ROOT_PATH;
  const APP_PATH = path.join(ROOT_PATH, 'app');
  var debug = require('debug')('baboon:app');
  var app = express();

  app.use(favicon(ROOT_PATH + '/app/favicon.ico'));
  app.use(logger('dev'));
  app.use(express.static(path.join(ROOT_PATH, '.tmp')));
  app.use(express.static(APP_PATH));
  app.use('/bower_components', express.static(path.join(ROOT_PATH, 'bower_components')));
  app.use(require('connect-livereload')({
    port: 35729
  }));

  // Just send the app-name.html or index.html to support HTML5Mode
  app.all('/:app*', function (req, res) {

    var app = req.params.app;
    var appFile = app + '.html';

    if (appFile === 'main.html' || !fs.existsSync(path.join(APP_PATH, appFile ))) {
      res.sendfile('index.html', {root: APP_PATH});
    }
    else {
      res.sendfile(appFile, {root: APP_PATH});
    }
  });

  return app;
};
