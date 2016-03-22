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
            scope: {
                min: '@',
                max: '@'
            },
            link: function (scope, elm, attrs, ngModel) {
                // watch for changes of the attribute min
                attrs.$observe('min', function (value) {
                    // only set value when min is an integer
                    if (value && INTEGER_REGEXP.test(value)) {
                        scope.minimun = parseInt(value, 10);
                    }
                });

                // watch for changes of the attribute max
                attrs.$observe('max', function (value) {
                    // only set value when max is an integer
                    if (value && INTEGER_REGEXP.test(value)) {
                        scope.maximum = parseInt(value, 10);
                    }
                });

                ngModel.$validators.lxinteger = function (value) {
                    return value === null || value === undefined ? true : INTEGER_REGEXP.test(value);
                };

                ngModel.$validators.min = function (value) {
                    if (angular.isNumber(scope.minimun) && INTEGER_REGEXP.test(value)) {
                        return parseInt(value, 10) >= scope.minimun;
                    }

                    return true;
                };

                ngModel.$validators.max = function (value) {
                    if (angular.isNumber(scope.maximum) && INTEGER_REGEXP.test(value)) {
                        return parseInt(value, 10) <= scope.maximum;
                    }

                    return true;
                };

                ngModel.$parsers.push(function (viewValue) {
                    if (!viewValue) {
                        return null;
                    }

                    return INTEGER_REGEXP.test(viewValue) ? parseInt(viewValue, 10) : NaN;
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
