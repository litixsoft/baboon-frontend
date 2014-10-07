'use strict';

angular.module('common.equals', [])
    .directive('lxEquals', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                if (!attrs.lxEquals) {
                    console.error('lxEquals expects a model as an argument!');
                    return;
                }

                ctrl.$validators.lxequals = function(modelValue, viewValue) {
                    var value = modelValue || viewValue;
                    var other = scope.$eval(attrs.lxEquals);
                    return value === other;
                };
            }
        };
    });