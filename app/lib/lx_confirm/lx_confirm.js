'use strict';

angular.module('lx.confirm', [])
    /**
     * @ngdoc object
     * @name lx.confirm.directive:lxConfirm
     *
     * @description
     * Directive which encapsulates a modal confirm window.
     *
     * For more information look at the [guide](/confirm).
     *
     */
    .directive('lxConfirm', function($modal) {
        return {
            restrict: 'A',
            scope: {
                lxConfirm: '&',
                lxConfirmMessage: '@',
                lxConfirmTitle: '@',
                lxConfirmYesText: '@',
                lxConfirmNoText: '@'
            },
            link: function (scope, element) {
                element.bind('click', function () {
                    var modalInstance = $modal.open({
                        template: '<div class="modal-header">' +
                            '<h3 class="modal-title">{{ ::data.title }}</h3>' +
                            '</div>' +
                            '<div class="modal-body">{{ ::data.message }}</div>' +
                            '<div class="modal-footer">' +
                            '<button class="btn btn-primary" ng-click="ok()">{{ ::data.yesText }}</button>' +
                            '<button class="btn btn-warning" ng-click="cancel()">{{ ::data.noText }}</button>' +
                            '</div>',
                        controller: function ($scope, $modalInstance, data) {
                            $scope.data = data;

                            $scope.ok = function () {
                                $modalInstance.close();
                            };
                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                        },
                        backdrop: 'static',
                        resolve: {
                            data: function () {
                                return {
                                    message: scope.lxConfirmMessage,
                                    title: scope.lxConfirmTitle,
                                    yesText: scope.lxConfirmYesText || 'Yes',
                                    noText: scope.lxConfirmNoText || 'No'
                                };
                            }
                        }
                    });

                    modalInstance.result.then(function () {
                        scope.lxConfirm();
                    });
                });
            }
        };
    });
