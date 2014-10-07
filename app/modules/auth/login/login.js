'use strict';

angular.module('auth.login', [])
    .config(function ($stateProvider) {
        $stateProvider.state('login', { url: '/auth/login', templateUrl: '/modules/auth/login/login.html', controller: 'AuthLoginCtrl' });
        $stateProvider.state('logout', { url: '/auth/logout', resolve: { logout: 'LogoutService' } });
    })
    .controller('AuthLoginCtrl', function ($scope, $window, Auth) {
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
                        for (var i = 0; i < err.data.length; i++) {
                            $scope.form[err.data[i].property].$setValidity('server', false);
                            $scope.form[err.data[i].property].$error.serverMsg = err.data[i].message;
                        }
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
        Auth.logout();
        $location.path('/auth/login');
    });
