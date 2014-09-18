'use strict';

angular.module('main.home', [
    'main.home.navexample',
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

    .controller('MainHomeCtrl', function ($scope, $http) {
        $scope.awesomeThings = [
            {
                name: 'HTML5 Boilerplate',
                info: 'HTML5 Boilerplate is a professional front-end template for building fast,' +
                    ' robust, and adaptable web apps or sites.'
            },
            {
                name: 'AngularJS',
                info: 'AngularJS is a toolset for building the framework most suited to your application development.'
            },
            {
                name: 'Karma',
                info: 'Spectacular Test Runner for JavaScript.'
            }
        ];

        //$http.get('http://localhost:3000/awesomeThings').
        //    success(function(data, status, headers, config) {
        //        // this callback will be called asynchronously
        //        // when the response is availablex
        //        console.log('REST');
        //        console.log(data);
        //    }).
        //    error(function(data, status, headers, config) {
        //        // called asynchronously if an error occurs
        //        // or server returns response with an error status.
        //        console.log(data);
        //    });
    });
