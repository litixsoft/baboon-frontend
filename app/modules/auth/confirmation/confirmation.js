'use strict';

angular.module('auth.confirmation', [])
    .config(function ($routeProvider) {
        $routeProvider.when('/auth/confirmation/:id', {templateUrl: '/modules/auth/confirmation/confirmation.html', controller: 'AuthConfirmationCtrl'});
    })
    .controller('AuthConfirmationCtrl', function ($scope, $routeParams, $location, Auth) {
        $scope.alerts = [];

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        var confirm = function () {
            $scope.alerts.length = 0;

            Auth.confirmation($routeParams.id)
                .success(function () {
                    $scope.alerts.push({ type: 'success', msg: 'Die Registrierungs ist nun abgeschlossen und Sie können sich am System anmelden.' });
                    $scope.success = true;
                }).
                error(function (err) {
                    if (err.status === 404) {
                        $scope.alerts.push({ type: 'danger', msg: 'Es wurden keine Daten gefunden.' });
                    }
                    else if (err.status === 409) {
                        $scope.alerts.push({ type: 'danger', msg: 'Der Zeitraum der Bestätigung ist abgelaufen.' });
                        $scope.isExpired = true;
                    }
                    else {
                        $scope.alerts.push({ type: 'danger', msg: 'Es ist ein Fehler aufgetreten.' });
                    }
                });
        };

        $scope.renew = function () {
            $scope.alerts.length = 0;
            $scope.isExpired = false;

            var url = $location.absUrl().substr(0, $location.absUrl().indexOf('/confirmation') + 13);
            $scope.alerts.push({ type: 'info', msg: 'Die Bestätigungsmail wird erneut gesendet...' });

            Auth.renew($routeParams.id, url)
                .success(function () {
                    $scope.alerts.length = 0;
                    $scope.alerts.push({ type: 'success', msg: 'Es wurde eine neue Bestätigungsmail an die hinterlegte E-Mail Adresse geschickt.' });
                })
                .error(function () {
                    $scope.alerts.length = 0;
                    $scope.alerts.push({ type: 'danger', msg: 'Es ist ein Fehler aufgetreten.' });
                });
        };

        confirm();
    });
