'use strict';
angular.module('lx.focus', [])
    .directive('lxFocus', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                attrs.$observe('lxFocus', function (value) {
                    var shouldHaveFocus = scope.$eval(value);

                    if (shouldHaveFocus === true) {
                        $timeout(function () {
                            element[0].focus();
                        });
                    }
                });
            }
        };
    });
