'use strict';

angular.module('admin', [
  'navigation',
  'ui.router',
  'ui.bootstrap',
  'admin.home'
])
  .constant('ACTIVE_APP', 'admin')
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    // Routing and navigation
    $urlRouterProvider.otherwise('/admin/home');
    $locationProvider.html5Mode(true);
  });

