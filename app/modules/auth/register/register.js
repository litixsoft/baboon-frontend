'use strict';

angular.module('auth.register', [])
    .config(function ($routeProvider) {
        $routeProvider.when('/auth/register', {templateUrl: '/modules/auth/register/register.html', controller: 'AuthRegisterCtrl'});
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
                .error(function (err) {
                    $scope.requesting = false;
                    if(err.status === 422 && err.data) {
                        lxUtils.populateServerErrors(err.data.errors || err.data, $scope.form);
                    }
                    else {
                        $scope.alerts.push({ msg: 'Es ist ein Fehler aufgetreten.' });
                    }
                });
        };
    });
