'use strict';

angular.module('examples.lib', [
    'ngMessages',
    'lx.integer',
    'lx.float',
    'lx.confirm'
])
    .config(function ($routeProvider) {
        $routeProvider.when('/examples/lib', {templateUrl: '/modules/examples/lib/lib.html', controller: 'LibCtrl'});
    })
    .controller('LibCtrl', function ($scope, lxForm, lxCache) {
        $scope.lxForm = lxForm('data');
        $scope.lxCache = lxCache;
        $scope.initialPageSize = 10;
        $scope.pagingOptions = {skip: 0, limit: $scope.initialPageSize};

        var items = [];
        for (var i = 0; i < 100; i++) {
            items.push({name: 'Item ' + (i + 1), index: i});
        }

        $scope.getData = function (pagingOptions) {
            $scope.items = items.slice(pagingOptions.skip, pagingOptions.skip + pagingOptions.limit);
            $scope.count = 100;
        };

        $scope.getData($scope.pagingOptions);

        $scope.simulateServerErrors = function () {
            var errors = [
                {property: 'name', message: 'invalid name'},
                {property: 'myFloat', message: 'invalid float'}
            ];

            $scope.lxForm.populateServerValidation($scope.myForm, errors);
        };

        $scope.simulateSuccessfullSave = function () {
            $scope.lxForm.setModel($scope.lxForm.model);

            $scope.lxForm.reset($scope.myForm);
        };

        $scope.delete = function () {

        };
    });

