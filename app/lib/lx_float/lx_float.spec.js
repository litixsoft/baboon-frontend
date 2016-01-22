'use strict';

describe('lxFloat', function () {
    describe('Tests with valid directive configuration', function () {
        var scope, form;

        beforeEach(module('lx.float'));

        beforeEach(inject(function ($compile, $rootScope) {
            scope = $rootScope.$new();

            var element = angular.element(
                '<form name="form">' +
                '<intput type="text" ng-model="model.val" name="val" lx-float="2" />' +
                '</form>'
                );

            scope.model = { val: 12.34 };
            $compile(element)(scope);
            scope.$digest();
            form = scope.form;
        }));

        it('should be initialized correctly', function () {
            expect(scope.model.val).toBe(12.34);
        });

        it('should pass with integer', function () {
            form.val.$setViewValue(1);
            expect(scope.model.val).toEqual(1);
            expect(form.val.$valid).toBe(true);
        });

        it('should pass with float', function () {
            form.val.$setViewValue(4.25);
            expect(scope.model.val).toEqual(4.25);
            expect(form.val.$valid).toBe(true);
        });

        it('should pass with string', function () {
            form.val.$setViewValue('3.25');
            expect(scope.model.val).toEqual(3.25);
            expect(form.val.$valid).toBe(true);
        });

        it('should not pass with date', function () {
            form.val.$setViewValue(new Date());
            expect(scope.model.val).toBeUndefined();
            expect(form.val.$valid).toBe(false);
        });

        it('should not pass with boolean', function () {
            form.val.$setViewValue(true);
            expect(scope.model.val).toBeUndefined();
            expect(form.val.$valid).toBe(false);
        });

        it('should not pass with an array', function () {
            form.val.$setViewValue([1, 2, 3]);
            expect(scope.model.val).toBeUndefined();
            expect(form.val.$valid).toBe(false);
        });

        it('should not pass with an object', function () {
            form.val.$setViewValue({ Value1: 'John', Value2: 'Doe' });
            expect(scope.model.val).toBeUndefined();
            expect(form.val.$valid).toBe(false);
        });

        it('should pass with undefined', function () {
            form.val.$setViewValue(undefined);
            expect(scope.model.val).toBeUndefined();
            expect(form.val.$valid).toBe(true);
        });

        it('should pass with null', function () {
            form.val.$setViewValue(null);
            expect(scope.model.val).toBeNull();
            expect(form.val.$valid).toBe(true);
        });

        it('should pass with negative number', function () {
            form.val.$setViewValue('-3,25');
            expect(scope.model.val).toBe(-3.25);
            expect(form.val.$valid).toBe(true);
        });

        it('should be round a long number', function () {
            form.val.$setViewValue(3.2355);
            expect(scope.model.val).toBe(3.24);
            expect(form.val.$valid).toBe(true);
        });

        it('should return null if model is null', function () {
            scope.model.val = null;
            scope.$digest();
            expect(form.val.$viewValue).toBe(null);
            expect(form.val.$valid).toBe(true);
        });

        it('should not pass if model is NaN', function () {
            scope.model.val = 'NaN';
            scope.$digest();
            expect(form.val.$valid).toBe(false);
        });

        it('should not pass if model is NaN 2', function () {
            scope.model.val = '3.23.4';
            scope.$digest();
            expect(form.val.$valid).toBe(false);
        });

        it('should not pass if model is NaN 2', function () {
            scope.model.val = '3,23,4';
            scope.$digest();
            expect(form.val.$valid).toBe(false);
        });

        it('should not pass if model is NaN 2', function () {
            scope.model.val = '3.23,4';
            scope.$digest();
            expect(form.val.$valid).toBe(false);
        });
    });

    describe('Tests with rounding disabled', function () {
        var scope, form;

        beforeEach(module('lx.float'));

        beforeEach(inject(function ($compile, $rootScope) {
            scope = $rootScope.$new();

            var element = angular.element(
                '<form name="form">' +
                '<intput type="text" ng-model="model.val" name="val" lx-float="{{config.digits}}" lx-float-round="{{config.round}}" />' +
                '</form>'
                );

            scope.model = { val: 12.34 };
            scope.config = {
                digits: 2,
                round: false
            };
            $compile(element)(scope);
            scope.$digest();
            form = scope.form;
        }));

        it('should display a number but not round', function () {
            scope.model.val = 99.99999999;
            scope.$digest();
            expect(form.val.$viewValue).toBe('99,99');
            expect(form.val.$valid).toBeTruthy();
        });

        it('should display a number but not round', function () {
            scope.model.val = 99.9;
            scope.$digest();
            expect(form.val.$viewValue).toBe('99,90');
            expect(form.val.$valid).toBeTruthy();
        });

        it('should display a number but not round', function () {
            scope.model.val = 99;
            scope.$digest();
            expect(form.val.$viewValue).toBe('99,00');
            expect(form.val.$valid).toBeTruthy();
        });

        it('should display a number and detetct changes to rounding', function () {
            scope.config.round = true;
            scope.$digest();
            scope.model.val = 99.99999999;
            scope.$digest();
            expect(form.val.$viewValue).toBe('100,00');
            expect(form.val.$valid).toBeTruthy();
        });

        it('should display a number and detect changes to digits', function () {
            scope.config.digits = 3;
            scope.$digest();
            scope.model.val = 99.99999999;
            scope.$digest();
            expect(form.val.$viewValue).toBe('99,999');
            expect(form.val.$valid).toBeTruthy();
        });

        it('should display a number and detect changes to digits and set digits to 0 when digits is out of range', function () {
            scope.config.digits = -1;
            scope.$digest();
            scope.model.val = 99.99999999;
            scope.$digest();
            expect(form.val.$viewValue).toBe('99');
            expect(form.val.$valid).toBeTruthy();
        });

        it('should display a number and detect changes to digits and set digits to 0 when digits is out of range', function () {
            scope.config.digits = 22;
            scope.$digest();
            scope.model.val = 99.99999999;
            scope.$digest();
            expect(form.val.$viewValue).toBe('99');
            expect(form.val.$valid).toBeTruthy();
        });

        it('should display a number and detect changes to digits and ignore changes to digits when digits is not a number', function () {
            scope.config.digits = 'a';
            scope.$digest();
            scope.model.val = 99.99999999;
            scope.$digest();
            expect(form.val.$viewValue).toBe('99,99');
            expect(form.val.$valid).toBeTruthy();
        });

        it('should display a number and detect changes to digits and ignore changes to digits when digits is not a number', function () {
            scope.config.digits = 2.5;
            scope.$digest();
            scope.model.val = 99.99999999;
            scope.$digest();
            expect(form.val.$viewValue).toBe('99,99');
            expect(form.val.$valid).toBeTruthy();
        });
    });

    describe('Tests with invalid directive configuration', function () {
        var scope, form;

        beforeEach(module('lx.float'));

        beforeEach(inject(function ($compile, $rootScope) {
            scope = $rootScope.$new();

            var element = angular.element(
                '<form name="form">' +
                    '<intput type="text" ng-model="model.val" name="val" lx-float="a" />' +
                    '</form>'
            );

            scope.model = {val: 12.34};
            $compile(element)(scope);
            scope.$digest();
            form = scope.form;
        }));

        it('should be initialized correctly', function () {
            expect(scope.model.val).toBe(12.34);
        });

        it('should pass with default numberOfDigits = 2', function() {
            form.val.$setViewValue(1.234);
            expect(scope.model.val).toEqual(1.23);
            expect(form.val.$valid).toBe(true);
        });
    });
});
