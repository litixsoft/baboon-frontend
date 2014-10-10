'use strict';

angular.module('main', [
  'navigation',
  'ui.router',
  'ui.bootstrap',
  'main.home',
  'main.about',
  'main.contact'
])
  .constant('ACTIVE_APP', 'main')
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    // Routing and navigation
    $urlRouterProvider.otherwise('/main/home');
    $locationProvider.html5Mode(true);
  })
    .run(function($rootScope){

        $rootScope.pathNav = 'common/navigation/nav_list.html';
        $rootScope.pathNavTree = 'common/navigation/nav_tree_outside.html';
    });
