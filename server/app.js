var fs = require('fs');
var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cors = require('cors');

/**
 *
 * @param options
 */
module.exports = function(options) {

  var config = options.config;

  if (! config) {
    throw new Error('Parameter Error: config required');
  }

  config.APP_PATH = path.join(config.ROOT_PATH, 'app');

  var debug = require('debug')('baboon:app');
  var app = express();
  var env = app.get('env');
  var RELOAD = process.env.RELOAD || null;

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(methodOverride());
  app.use(cors());
  app.use(logger('dev'));

  // development config
  if ('development' === env ) {

    // Check livereload
    if (RELOAD) {
      app.use(require('connect-livereload')());
    }

    app.use(favicon(config.ROOT_PATH + '/app/favicon.ico'));
    app.use(express.static(path.join(config.ROOT_PATH, '.tmp')));
    app.use(express.static(config.APP_PATH));
    //app.use('/bower_components', express.static(path.join(config.ROOT_PATH, 'bower_components')));
  }

  // production config
  if ('production' === env ) {
    app.use(compression());
    app.use(favicon(config.ROOT_PATH + '/build/dist/favicon.ico'));
    config.APP_PATH = path.join(config.ROOT_PATH, 'build', 'dist');
    app.use(express.static(config.APP_PATH, {maxAge: '10d'}));
  }

  // Just send the app-name.html or index.html to support HTML5Mode ..
  app.all('/:app*', function (req, res) {

    var app = req.params.app;
    var appFile = app + '.html';

    if (appFile === 'main.html' || !fs.existsSync(path.join(config.APP_PATH, appFile ))) {
      res.sendfile('index.html', {root: config.APP_PATH});
    }
    else {
      res.sendfile(appFile, {root: config.APP_PATH});
    }
  });

  return app;
};
