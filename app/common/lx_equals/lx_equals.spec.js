'use strict';

describe('lxEqualsTest', function () {
    var scope, form;

    beforeEach(module('common.equals'));

    beforeEach(inject(function ($compile, $rootScope) {
        // init scope
        scope = $rootScope.$new();

        var element = angular.element(
            '<form name="form">' +
            '<input type="password" ng-model="model.password" name="password">' +
            '<input type="password" ng-model="model.password2" name="password2" lx-equals="model.password">' +
            '</form>'
        );

        scope.model = {};
        $compile(element)(scope);
        scope.$digest();
        form = scope.form;
    }));

    it('should be initialized correctly', function () {
        expect(scope.model.password).toBeUndefined();
        expect(scope.model.password2).toBeUndefined();
    });

    it('should pass with same password', function () {
        form.password.$setViewValue('password');
        form.password2.$setViewValue('password');
        expect(scope.model.password).toEqual('password');
        expect(scope.model.password2).toEqual('password');
        expect(form.password.$valid).toBe(true);
        expect(form.password2.$valid).toBe(true);
    });

    it('should pass with same password', function () {
        form.password.$setViewValue('password');
        form.password2.$setViewValue('password2');
        expect(scope.model.password).toEqual('password');
        expect(scope.model.password2).toBeUndefined();
        expect(form.password.$valid).toBe(true);
        expect(form.password2.$valid).toBe(false);
    });

    it('should return null if model is null', function () {
        scope.model.password = null;
        scope.model.password2 = null;
        scope.$digest();
        expect(form.password2.$viewValue).toBe(null);
        expect(form.password2.$valid).toBe(true);
    });

    it('should pass with valid model', function () {
        scope.model.password = 'password';
        scope.model.password2 = 'password';
        scope.$digest();
        expect(form.password.$valid).toBe(true);
        expect(form.password2.$valid).toBe(true);
    });

    it('should not pass with invalid model', function () {
        scope.model.password = 'password';
        scope.model.password2 = 'password2';
        scope.$digest();
        expect(form.password.$valid).toBe(true);
        expect(form.password2.$valid).toBe(false);
    });

    it('should print an error if attribute is missing', function () {
        inject(function ($compile) {
            spyOn(console, 'error');

            var element = angular.element(
                '<form name="form">' +
                '<input type="password" ng-model="model.password" name="password">' +
                '<input type="password" ng-model="model.password2" name="password2" lx-equals>' +
                '</form>'
            );

            scope.model = {};
            $compile(element)(scope);
            scope.$digest();
            form = scope.form;

            expect(console.error).toHaveBeenCalled();
        });
    });
});
