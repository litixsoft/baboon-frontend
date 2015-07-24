'use strict';

angular.module('lx.float', [])
/**
 * @ngdoc directive
 * @name lx.float.directive:lxFloat
 * @restrict A
 * @element input
 *
 * @description
 * Convert and round any number to a float by given decimal places. It replaces a decimal comma with an decimal point. An non-float-input returns undefined.
 *
 * For more information look at the [guide](/float).
 *
 * @param {number=} [lx-float=2] Number of decimal places.
 *
 */
    .directive('lxFloat', function () {
        var FLOAT_REGEXP = /^\-?\d+((\.|,)?(\d+)?)?$/;

        function roundToDecimal (number, decimal) {
            var zeros = 1.0.toFixed(decimal);
            zeros = zeros.substr(2);
            var mul_div = parseInt('1' + zeros, 10);
            var increment = parseFloat('.' + zeros + '01');

            if (number * (mul_div * 10) % 10 >= 5) {
                number += increment;
            }

            return Math.round(number * mul_div) / mul_div;
        }

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elm, attrs, ngModel) {
                // default value
                var numberOfDigits = 2;

                // set number of digits synchronously
                var val = scope.$eval(attrs.lxFloat);
                if (typeof val === 'number') {
                    numberOfDigits = val;
                }

                // get the number of digits from attr asynchronously
                attrs.$observe('lxFloat', function (value) {
                    value = scope.$eval(value);

                    if (typeof value === 'number') {
                        numberOfDigits = value;
                    }
                });

                ngModel.$validators.lxfloat = function (value) {
                    return value === null || value === undefined ? true : FLOAT_REGEXP.test(value);
                };

                ngModel.$parsers.push(function (viewValue) {
                    if (!viewValue) {
                        return null;
                    }

                    if (FLOAT_REGEXP.test(viewValue)) {
                        return typeof viewValue === 'number' ? roundToDecimal(viewValue, numberOfDigits) : roundToDecimal(parseFloat(viewValue.replace(',', '.')), numberOfDigits);
                    }

                    return NaN;
                });

                ngModel.$formatters.unshift(function (modelValue) {
                    if (!isNaN(modelValue) && modelValue !== null) {
                        modelValue = parseFloat(modelValue).toFixed(numberOfDigits).replace('.', ',');
                    }

                    return modelValue;
                });
            }
        };
    });
