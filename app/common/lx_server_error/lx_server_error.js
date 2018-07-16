'use strict';

angular.module('common.servererror', [])
    .directive('lxServerError', function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, elem, attrs, ctrl) {
                ctrl.$validators.server = function () {
                    delete ctrl.$error.serverMsg;
                    return true;
                };
            }
        };
    });
