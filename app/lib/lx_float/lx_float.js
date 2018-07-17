'use strict';

angular.module('lx.float', [])
/**
 * @ngdoc directive
 * @name lx.float.directive:lxFloat
 * @restrict A
 * @element input
 *
 * @description
 * Convert and round any number to a float by given decimal places. It replaces a decimal comma with an decimal point. An non-float-input returns undefined. Optionally you can specify if the number should not be rounded.
 *
 * For more information look at the [guide](/float).
 *
 * @param {number=}  [lx-float=2] Number of decimal places. (Default is 2)
 * @param {boolean=} [lx-float-round=true] Specifies if the number should be rounded. (Default is true)
 *
 */
    .directive('lxFloat', function () {
        var FLOAT_REGEXP = /^-?\d+((\.|,)?(\d+)?)?$/;

        function roundToDecimal(number, decimal) {
            var zeros = 1.0.toFixed(decimal);
            zeros = zeros.substr(2);
            var mul_div = parseInt('1' + zeros, 10);
            var increment = parseFloat('.' + zeros + '01');

            if (number * (mul_div * 10) % 10 >= 5) {
                number += increment;
            }

            return Math.round(number * mul_div) / mul_div;
        }

        function cutToDecimal(number, decimal) {
            // check range for decimal value
            if (decimal < 0 || decimal > 20) {
                decimal = 0;
            }

            // ensure decimal is an integer
            decimal = Math.floor(decimal);

            var multiplier = Math.pow(10, decimal);
            return (Math.floor(parseFloat(number) * multiplier) / multiplier).toFixed(decimal);
        }

        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                min: '@',
                max: '@'
            },
            link: function (scope, elm, attrs, ngModel) {
                // default values
                var numberOfDigits = 2;
                var roundNumbers = true;

                // set number of digits synchronously
                var val = scope.$eval(attrs.lxFloat);
                if (typeof val === 'number') {
                    numberOfDigits = val;
                }

                // get if the numbers should be rounded from attr synchronously
                var round = scope.$eval(attrs.lxFloatRound);
                if (typeof round === 'boolean') {
                    roundNumbers = round;
                }

                // get the number of digits from attr asynchronously
                attrs.$observe('lxFloat', function (value) {
                    value = scope.$eval(value);

                    if (typeof value === 'number') {
                        numberOfDigits = value;
                    }
                });

                // get if the numbers should be rounded from attr asynchronously
                attrs.$observe('lxFloatRound', function (value) {
                    value = scope.$eval(value);

                    if (typeof value === 'boolean') {
                        roundNumbers = value;
                    }
                });

                // watch for changes of the attribute min
                attrs.$observe('min', function (value) {
                    // only set value when min is a float
                    if (value && FLOAT_REGEXP.test(value)) {
                        scope.minimun = roundToDecimal(parseFloat(value.replace(',', '.')), numberOfDigits);
                    }
                });

                // watch for changes of the attribute max
                attrs.$observe('max', function (value) {
                    // only set value when max is a float
                    if (value && FLOAT_REGEXP.test(value)) {
                        scope.maximum = roundToDecimal(parseFloat(value.replace(',', '.')), numberOfDigits);
                    }
                });

                ngModel.$validators.lxfloat = function (value) {
                    return value === null || value === undefined ? true : FLOAT_REGEXP.test(value);
                };

                ngModel.$validators.min = function (value) {
                    if (angular.isNumber(scope.minimun) && FLOAT_REGEXP.test(value)) {
                        var v = typeof value === 'number' ? roundToDecimal(value, numberOfDigits) : roundToDecimal(parseFloat(value.replace(',', '.')), numberOfDigits);
                        return v >= scope.minimun;
                    }

                    return true;
                };

                ngModel.$validators.max = function (value) {
                    if (angular.isNumber(scope.maximum) && FLOAT_REGEXP.test(value)) {
                        var v = typeof value === 'number' ? roundToDecimal(value, numberOfDigits) : roundToDecimal(parseFloat(value.replace(',', '.')), numberOfDigits);
                        return v <= scope.maximum;
                    }

                    return true;
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
                        if (roundNumbers) {
                            modelValue = parseFloat(modelValue).toFixed(numberOfDigits);
                        } else {
                            modelValue = cutToDecimal(modelValue, numberOfDigits);
                        }

                        modelValue = modelValue.replace('.', ',');
                    }

                    return modelValue;
                });
            }
        };
    });
