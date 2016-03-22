'use strict';

describe('lxInteger', function () {
    /*eslint-disable no-unused-vars */
    var scope, form, compile;
    /*eslint-enable no-unused-vars */

    beforeEach(module('lx.integer'));

    beforeEach(inject(function ($compile, $rootScope) {
        // init scope
        scope = $rootScope.$new();
        compile = $compile;

        var element = angular.element(
                '<form name="form">' +
                '<intput type="text" ng-model="model.val" name="val" lx-integer />' +
                '</form>'
        );

        scope.model = {};
        $compile(element)(scope);
        scope.$digest();
        form = scope.form;
    }));

    it('should be initialized correctly', function () {
        expect(scope.model.val).toBeUndefined();
    });

    it('should pass with integer', function () {
        form.val.$setViewValue(1);
        expect(scope.model.val).toEqual(1);
        expect(form.val.$valid).toBe(true);
    });

    it('should pass with negative integer', function () {
        form.val.$setViewValue(-1);
        expect(scope.model.val).toEqual(-1);
        expect(form.val.$valid).toBe(true);
    });

    it('should not pass with float', function () {
        form.val.$setViewValue(4.25);
        expect(scope.model.val).toBeUndefined();
        expect(form.val.$valid).toBe(false);
    });

    it('should pass with string', function () {
        form.val.$setViewValue('3');
        expect(scope.model.val).toEqual(3);
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

    it('should pass with valid model', function () {
        scope.model.val = 1;
        scope.$digest();
        expect(form.val.$valid).toBe(true);
    });

    describe('with min and max attribute', function () {
        beforeEach(inject(function ($compile, $rootScope) {
            // init scope
            scope = $rootScope.$new();
            compile = $compile;

            var element = angular.element(
                '<form name="form">' +
                '<intput type="text" ng-model="model.val" name="val" lx-integer min="20" max="30"/>' +
                '</form>'
            );

            scope.model = {};
            $compile(element)(scope);
            scope.$digest();
            form = scope.form;
        }));

        it('should be valid when value is in range', function () {
            form.val.$setViewValue('25');
            expect(scope.model.val).toBe(25);
            expect(form.val.$valid).toBe(true);
        });

        it('should be invalid when value is less than minimum', function () {
            form.val.$setViewValue('5');
            expect(scope.model.val).toBeUndefined();
            expect(form.val.$valid).toBe(false);
            expect(form.val.$error.min).toBe(true);
        });

        it('should be invalid when value is greater than maximum', function () {
            form.val.$setViewValue('40');
            expect(scope.model.val).toBeUndefined();
            expect(form.val.$valid).toBe(false);
            expect(form.val.$error.max).toBe(true);
        });
    });
});
