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
            var zeros = (1.0).toFixed(decimal);
            zeros = zeros.substr(2);
            var mul_div = parseInt('1' + zeros, 10);
            var increment = parseFloat('.' + zeros + '01');

            if (( (number * (mul_div * 10)) % 10) >= 5) {
                number += increment;
            }

            return Math.round(number * mul_div) / mul_div;
        }

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elm, attrs, ngModel) {
                var numberOfDigits = 2;

                // get the number of digits from attr
                attrs.$observe('lxFloat', function (value) {
                    value = scope.$eval(value);

                    if (typeof value === 'number') {
                        numberOfDigits = value;
                    }
                });

                ngModel.$validators.float = function (value) {
                    return value === null ? true : FLOAT_REGEXP.test(value);
                };

                ngModel.$parsers.push(function (viewValue) {
                    if (!viewValue) {
                        return null;
                    }

                    if (FLOAT_REGEXP.test(viewValue)) {
                        return typeof viewValue === 'number' ? roundToDecimal(viewValue, numberOfDigits) : roundToDecimal(parseFloat(viewValue.replace(',', '.')), numberOfDigits);
                    } else {
                        return NaN;
                    }




//
//                    if (!viewValue) {
//                        // reset validation
//                        ngModel.$setValidity('float', true);
//                        return null;
//                    }
//
//                    if (FLOAT_REGEXP.test(viewValue)) {
//                        // it is valid
//                        ngModel.$setValidity('float', true);
//
//                        return typeof viewValue === 'number' ? roundToDecimal(viewValue, numberOfDigits) : roundToDecimal(parseFloat(viewValue.replace(',', '.')), numberOfDigits);
//                    } else {
//                        // it is invalid, return undefined (no model update)
//                        ngModel.$setValidity('float', false);
//
//                        return undefined;
//                    }
                });

                ngModel.$formatters.unshift(function (modelValue) {
                    if (!isNaN(modelValue) && modelValue !== null) {
                        modelValue = parseInt(modelValue, 10).toString();
                    }

                    return modelValue;





//                    if (modelValue === undefined || modelValue === null) {
//                        ctrl.$setValidity('float', true);
//                        return modelValue;
//                    }
//
//                    ctrl.$setValidity('float', !isNaN(modelValue));
//
//                    if (!isNaN(modelValue)) {
//                        modelValue = parseFloat(modelValue).toFixed(numberOfDigits).replace('.', ',');
//                    }
//
//                    return modelValue;
                });
            }
        };
    });