'use strict';

angular.module('examples.home', [])
  .config(function ($stateProvider) {
    $stateProvider.state('examplesHome', {
      url: '/examples/home', templateUrl: '/modules/examples/home/home.html'
    });
  });
