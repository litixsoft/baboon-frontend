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
                .success(function () {
                    $window.location.href = '/main/home';
                })
                .error(function (error, status) {
                    $scope.requesting = false;

                    if (status === 422 && error) {
                        lxUtils.populateServerErrors(error.errors || error, $scope.form);
                    } else if (status === 404 || status === 403) {
                        $scope.alerts.push({msg: 'Die E-Mail oder das Passwort ist falsch.'});
                    } else {
                        $scope.alerts.push({msg: 'Es ist ein Fehler aufgetreten.'});
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
