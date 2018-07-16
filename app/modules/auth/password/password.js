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
                .then(function () {
                    $scope.alerts.push({
                        type: 'success',
                        msg: 'Das neue Passwort wurde an die hinterlegte E-Mail Adresse gesendet.'
                    });
                    $scope.requesting = false;
                })
                .catch(function (response) {
                    $scope.requesting = false;

                    if (response.status === 422 && response.error) {
                        lxUtils.populateServerErrors(response.error.errors || response.error, $scope.form);
                    } else if (response.status === 404) {
                        $scope.alerts.push({ type: 'danger', msg: 'Die E-Mail ist nicht vorhanden.' });
                    } else {
                        $scope.alerts.push({ type: 'danger', msg: 'Es ist ein Fehler aufgetreten.' });
                    }
                });
        };

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };
    });
