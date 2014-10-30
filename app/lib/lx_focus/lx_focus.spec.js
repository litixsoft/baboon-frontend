'use strict';

describe('lxFocus', function () {
    describe('Tests with valid directive configuration', function () {
        var scope;

        beforeEach(module('lx.focus'));

        it('should set the focus', function () {
            inject(function ($compile, $rootScope, _$timeout_) {
                scope = $rootScope.$new();

                var element = angular.element(
                    '<form name="form">' +
                    '<intput type="text" ng-model="model.val" name="val" lx-focus="true"/>' +
                    '<span>count: {{count}}</span>' +
                    '</form>'
                );

                $compile(element)(scope);
                scope.$digest();
                _$timeout_.flush();
            });
        });

        it('should not set the focus', function () {
            inject(function ($compile, $rootScope, _$timeout_) {
                scope = $rootScope.$new();

                var element = angular.element(
                    '<form name="form">' +
                    '<intput type="text" ng-model="model.val" name="val" lx-focus="false"/>' +
                    '<span>count: {{count}}</span>' +
                    '</form>'
                );

                $compile(element)(scope);
                scope.$digest();
                _$timeout_.flush();
            });
        });
    });
});
