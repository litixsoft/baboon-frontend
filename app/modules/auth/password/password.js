'use strict';

angular.module('auth.password', [])
    .config(function ($routeProvider) {
        $routeProvider.when('/auth/password', {
            templateUrl: '/modules/auth/password/password.html',
            controller: 'AuthPasswordCtrl'
        });
    })
    .controller('AuthPasswordCtrl', function ($scope, Auth, lxUtils) {
        $scope.alerts = [];

        $scope.send = function (model) {
            $scope.alerts.length = 0;

            if ($scope.form.$invalid) {
                return;
            }

            $scope.requesting = true;

            Auth.password(model)
                .success(function () {
                    $scope.alerts.push({
                        type: 'success',
                        msg: 'Das neue Passwort wurde an die hinterlegte E-Mail Adresse gesendet.'
                    });
                    $scope.requesting = false;
                })
                .error(function (error, status) {
                    $scope.requesting = false;

                    if (status === 422 && error) {
                        lxUtils.populateServerErrors(error.errors || error, $scope.form);
                    } else if (status === 404) {
                        $scope.alerts.push({type: 'danger', msg: 'Die E-Mail ist nicht vorhanden.'});
                    } else {
                        $scope.alerts.push({type: 'danger', msg: 'Es ist ein Fehler aufgetreten.'});
                    }
                });
        };

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };
    });
