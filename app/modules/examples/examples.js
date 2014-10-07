'use strict';

angular.module('examples', [
  'navigation',
  'ui.router',
  'ui.bootstrap',
  'examples.home'
])
  .constant('ACTIVE_APP', 'examples')
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    // Routing and navigation
    $urlRouterProvider.otherwise('/examples/home');
    $locationProvider.html5Mode(true);
  });

