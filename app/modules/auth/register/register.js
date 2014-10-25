'use strict';

angular.module('auth.register', [])
    .config(function ($routeProvider) {
        $routeProvider.when('/auth/register', {
            templateUrl: '/modules/auth/register/register.html',
            controller: 'AuthRegisterCtrl'
        });
    })
    .controller('AuthRegisterCtrl', function ($scope, $location, Auth, lxUtils) {
        $scope.alerts = [];

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.register = function (user) {
            $scope.alerts.length = 0;

            if ($scope.form.$invalid) {
                return;
            }

            user.confirmationUrl = $location.absUrl().replace('register', 'confirmation');
            $scope.requesting = true;

            Auth.register(user)
                .success(function () {
                    $location.path('/auth/login');
                })
                .error(function (error, status) {
                    $scope.requesting = false;

                    if (status === 422 && error) {
                        lxUtils.populateServerErrors(error.errors || error, $scope.form);
                    } else {
                        $scope.alerts.push({msg: 'Es ist ein Fehler aufgetreten.'});
                    }
                });
        };
    });
