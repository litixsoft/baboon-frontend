'use strict';

angular.module('main.home', [])
  .config(function ($stateProvider) {
    $stateProvider.state('mainHome',{
      url:'/main/home', templateUrl:'/modules/main/home/home.html'});
  });
