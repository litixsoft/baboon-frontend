'use strict';

angular.module('lx.integer', [])
/**
 * @ngdoc directive
 * @name lx.integer.directive:lxInteger
 * @restrict A
 * @element input
 *
 * @description
 * Converts a number to an integer. It convert an empty string to null and a non-number-string to undefined.
 *
 * For more information look at the [guide](/integer).
 */
    .directive('lxInteger', function () {
        var INTEGER_REGEXP = /^\-?\d+$/;

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elm, attrs, ngModel) {
                ngModel.$validators.lxinteger = function (value) {
                   return value === null || value === undefined ? true : INTEGER_REGEXP.test(value);
                };

                ngModel.$parsers.push(function (viewValue) {
                    if (!viewValue) {
                        return null;
                    }

                    return INTEGER_REGEXP.test(viewValue) ? parseInt(viewValue, 10) : NaN;
                    //if (INTEGER_REGEXP.test(viewValue)) {
                    //    return parseInt(viewValue, 10);
                    //} else {
                    //    return NaN;
                    //}
                });

                ngModel.$formatters.unshift(function (modelValue) {
                    if (!isNaN(modelValue) && modelValue !== null) {
                        modelValue = INTEGER_REGEXP.test(modelValue) ? parseInt(modelValue, 10).toString() : modelValue;
                    }

                    return modelValue;
                });
            }
        };
    });
