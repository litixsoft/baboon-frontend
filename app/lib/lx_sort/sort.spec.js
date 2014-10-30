'use strict';

describe('lxSort', function () {
    var element, compile, scope;

    beforeEach(module('lx.sort'));

    beforeEach(inject(function ($compile, $rootScope) {
        compile = $compile;
        scope = $rootScope.$new();
    }));

    it('should be sort correctly', function () {
        scope.sort = function (options) {
            expect(options.field).toBeDefined();
            expect(options.direction).toBeDefined();
            expect(options.field).toBe('name');
            expect(options.direction).toBe(-1);
        };

        scope.sortOpts = { field: 'name', direction: 1 };
        element = angular.element('<lx-sort sort-opts="sortOpts" field-name="name" on-sorting="sort(sortingOptions)"></lx-sort>');
        compile(element)(scope);
        scope.$digest();

        var elementScope = element.isolateScope();
        elementScope.sort();
    });

    it('should be sort correctly without direction', function () {
        scope.sort = function (options) {
            expect(options.field).toBeDefined();
            expect(options.direction).toBeDefined();
            expect(options.field).toBe('name');
            expect(options.direction).toBe(-1);
        };

        scope.sortOpts = { field: 'name' };
        element = angular.element('<lx-sort sort-opts="sortOpts" field-name="name" on-sorting="sort(sortingOptions)"></lx-sort>');
        compile(element)(scope);
        scope.$digest();

        var elementScope = element.isolateScope();
        elementScope.sort();
    });

    it('should be return without error', function () {
        scope.sort = function() {};

        spyOn(scope, 'sort');

        scope.sortOpts = { field: 'name', direction: 1 };
        element = angular.element('<lx-sort field-name="name" on-sorting="sort(sortingOptions)"></lx-sort>');
        compile(element)(scope);
        scope.$digest();

        var elementScope = element.isolateScope();
        elementScope.sort();

        expect(scope.sort).not.toHaveBeenCalled();
    });
});