'use strict';

angular.module('auth.login', [])
    .config(function ($stateProvider) {
        $stateProvider.state('login', { url: '/auth/login', templateUrl: '/modules/auth/login/login.html', controller: 'AuthLoginCtrl' });
        $stateProvider.state('logout', { url: '/auth/logout', resolve: { logout: function(LogoutService) { LogoutService.logout(); } } });
    })
    .controller('AuthLoginCtrl', function ($scope, $window, Auth, lxUtils) {
        $scope.alerts = [];

        $scope.login = function(model) {
            $scope.alerts.length = 0;

            if($scope.form.$invalid) {
                return;
            }

            $scope.requesting = true;
            Auth.login(model)
                .success(function() {
                    $window.location.href = '/main/home';
                })
                .error(function(err) {
                    $scope.requesting = false;
                    if(err.status === 400 && err.data) {
                        lxUtils.populateServerErrors(err.data, $scope.form);
                    }
                    else if(err.status === 404 || err.status === 403) {
                        $scope.alerts.push({ msg: 'Die E-Mail oder das Passwort ist falsch.' });
                    }
                    else {
                        $scope.alerts.push({ msg: 'Es ist ein Fehler aufgetreten.' });
                    }
                });
        };

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
    })
    .factory('LogoutService', function(Auth, $location) {
        return {
            logout: function() {
                Auth.logout();
                $location.path('/auth/login');
            }
        };
    });
