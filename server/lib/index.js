'use strict';

//exports.LxController = require('./LxController');
//exports.lxMongoDb = require('./lxMongoDb');
//exports.LxRouter = require('./LxRouter');
exports.LxConfig = require('./LxConfig');
exports.LxLoader = require('./LxLoader.js');

// Boot modules
exports.boot = {
  http: require('./boot/http'),
  restEcho: require('./boot/restEcho'),
  socketIo: require('./boot/socketIo'),
  socketIoEcho: require('./boot/socketIoEcho'),
  lxMongoDb: require('./boot/lxMongoDb')
};

