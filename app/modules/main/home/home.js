'use strict';

angular.module('main.home', [
    'main.home.about',
    'main.home.contact'
])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/main/home', {
                templateUrl: 'modules/main/home/home.html',
                controller: 'MainHomeCtrl',
                app: 'main'
            });
    })

  .controller('MainHomeCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
