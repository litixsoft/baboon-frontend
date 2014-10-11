'use strict';
angular.module('main', [
  'common',
  'navigation',
  'ui.router',
  'ui.bootstrap',
  'lx.transport',
  'main.home',
  'main.about',
  'main.contact'
])
  .constant('ACTIVE_APP', 'main')
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $lxTransportProvider) {

    // Routing and navigation
    $urlRouterProvider.otherwise('/main/home');
    $locationProvider.html5Mode(true);
    $lxTransportProvider.set('127.0.0.1:3000', {socketConnectOptions:{reconnection:true}});
  });

