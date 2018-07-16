'use strict';

angular.module('auth.login', [])
    .config(function ($routeProvider) {
        $routeProvider.when('/auth/login', {
            templateUrl: '/modules/auth/login/login.html',
            controller: 'AuthLoginCtrl'
        });
        $routeProvider.when('/auth/logout', {
            resolve: {
                logout: function (LogoutService) {
                    LogoutService.logout();
                }
            }
        });
    })
    .controller('AuthLoginCtrl', function ($scope, $window, Auth, lxUtils) {
        $scope.alerts = [];

        $scope.login = function (model) {
            $scope.alerts.length = 0;

            if ($scope.form.$invalid) {
                return;
            }

            $scope.requesting = true;
            Auth.login(model)
                .then(function () {
                    $window.location.href = '/main/home';
                })
                .catch(function (response) {
                    $scope.requesting = false;

                    if (response.status === 422 && response.error) {
                        lxUtils.populateServerErrors(response.error.errors || response.error, $scope.form);
                    } else if (response.status === 404 || response.status === 403) {
                        $scope.alerts.push({ msg: 'Die E-Mail oder das Passwort ist falsch.' });
                    } else {
                        $scope.alerts.push({ msg: 'Es ist ein Fehler aufgetreten.' });
                    }
                });
        };

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };
    })
    .factory('LogoutService', function (Auth, $location) {
        return {
            logout: function () {
                Auth.logout();
                $location.path('/auth/login');
            }
        };
    });
