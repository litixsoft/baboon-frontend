'use strict';

angular.module('examples.lib', [
    'ngMessages',
    'lx.integer',
    'lx.float'
])
    .config(function ($routeProvider) {
        $routeProvider.when('/examples/lib', {templateUrl: '/modules/examples/lib/lib.html', controller: 'LibCtrl'});
    })
    .controller('LibCtrl', function ($scope) {
        $scope.data = {};
    });

