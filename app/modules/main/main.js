'use strict';

angular.module('main', [
  //'common.navigation',
  'lx.layout.directives',
  'ui.router',
  'ui.bootstrap',
  'main.home',
  'main.about',
  'main.contact',
  'main.navExample'
])
  .constant('ACTIVE_APP', 'main')
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    // Routing and navigation
    $urlRouterProvider.otherwise('/main/home');
    $locationProvider.html5Mode(true);
  });
