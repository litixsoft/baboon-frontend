'use strict';
angular.module('main', [
  'common',
  'navigation',
  'ui.router',
  'ui.bootstrap',
  'lx.socket',
  'main.home',
  'main.about',
  'main.contact'
])
  .constant('ACTIVE_APP', 'main')
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    // Routing and navigation
    $urlRouterProvider.otherwise('/main/home');
    $locationProvider.html5Mode(true);
  });

