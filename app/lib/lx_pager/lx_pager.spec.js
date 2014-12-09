'use strict';

describe('lxPager', function () {
    var element, compile, scope;

    beforeEach(module('lx.pager'));

    beforeEach(inject(function ($compile, $rootScope) {
        compile = $compile;

        // init scope
        scope = $rootScope.$new();
        scope.count = 10;
        scope.pageSizes = [1, 5, 10];
        scope.getData = angular.noop;

        spyOn(scope, 'getData');

        // create pager element
        element = angular.element('<lx-pager count="count" page-sizes="{{ pageSizes }}" on-paging="getData(pagingOptions)"></lx-pager>');
        compile(element)(scope);
        scope.$digest();
    }));

    it('should be initialized correctly', function () {
        var elementScope = element.isolateScope();

        expect(elementScope.count).toBe(10);
        expect(elementScope.currentPage).toBe(1);
        expect(scope.getData).not.toHaveBeenCalled();

        expect(elementScope.pageSize).toBe(10);
        expect(elementScope.pageSizeOptions).toEqual([1, 5, 10]);
        expect(scope.getData).not.toHaveBeenCalled();
    });

    it('should use the default page-Sizes if the page-Sizes injected through the attrs are no array', function () {
        scope.val = 23;
        element = angular.element('<lx-pager count="count" current-page="currentPage" page-sizes="{{ val }}" on-paging="getData(pagingOptions)"></lx-pager>');
        compile(element)(scope);
        scope.$digest();
        scope.$digest();
        var elementScope = element.isolateScope();

        scope.$digest();
        expect(elementScope.pageSizeOptions).toEqual([1, 5, 10, 25, 100]);
        expect(elementScope.currentPage).toBe(1);
    });

    it('should use the currentPage if the currentPage injected through the attrs', function () {
        scope.currentPage = 3;
        scope.count = 100;
        element = angular.element('<lx-pager count="count" current-page="currentPage" on-paging="getData(pagingOptions)"></lx-pager>');
        compile(element)(scope);
        scope.$digest();
        scope.$digest();
        var elementScope = element.isolateScope();

        scope.$digest();
        expect(elementScope.currentPage).toEqual(3);
    });

    it('should use the currentPage if the currentPage injected through the attrs with pageSize', function () {
        scope.currentPage = 3;
        scope.count = 100;
        scope.pagesize = 5;
        element = angular.element('<lx-pager count="count" current-page="currentPage" page-size="{{ pagesize }}" on-paging="getData(pagingOptions)"></lx-pager>');
        compile(element)(scope);
        scope.$digest();
        scope.$digest();
        var elementScope = element.isolateScope();

        scope.$digest();
        expect(elementScope.currentPage).toEqual(3);
    });

    it('should use the default page-Sizes if the page-Size injected through the attrs are no array', function () {
        scope.val = 'dd';
        element = angular.element('<lx-pager count="count" current-page="currentPage" page-size="{{ val }}" on-paging="getData(pagingOptions)"></lx-pager>');
        compile(element)(scope);
        scope.$digest();
        var elementScope = element.isolateScope();

        expect(elementScope.pageSize).toBe(10);
    });

    it('should use the pageSize attribute when specified', function () {
        scope.val = 50;
        element = angular.element('<lx-pager count="count" current-page="currentPage" page-size="{{ val }}" on-paging="getData(pagingOptions)"></lx-pager>');
        compile(element)(scope);
        scope.$digest();
        var elementScope = element.isolateScope();

        expect(elementScope.pageSizeOptions).toEqual([1, 5, 10, 25, 50, 100]);
        expect(elementScope.pageSize).toBe(50);
        expect(scope.getData).not.toHaveBeenCalled();
    });

    it('should use the pageSize attribute when specified and add the page size to the page size options', function () {
        scope.val = 33;
        element = angular.element('<lx-pager count="count" current-page="currentPage" page-size="{{ val }}" on-paging="getData(pagingOptions)"></lx-pager>');
        compile(element)(scope);
        scope.$digest();
        var elementScope = element.isolateScope();

        expect(elementScope.pageSizeOptions).toEqual([1, 5, 10, 25, 33, 100]);
        expect(elementScope.pageSize).toBe(33);
        expect(scope.getData).not.toHaveBeenCalled();
    });

    it('should use the pageSize attribute when specified and add the page size to the given page size options', function () {
        scope.val = 33;
        scope.val2 = [1, 2, 3];

        element = angular.element('<lx-pager count="count" current-page="currentPage" page-size="{{ val }}" page-sizes="{{ val2 }}" on-paging="getData(pagingOptions)"></lx-pager>');
        compile(element)(scope);
        scope.$digest();
        var elementScope = element.isolateScope();

        //expect(elementScope.pageSizeOptions).toEqual([1, 2, 3, 10, 33]);
        expect(elementScope.pageSize).toBe(33);
        expect(scope.getData).not.toHaveBeenCalled();
    });

    it('should parse the page-Sizes if the page-Sizes injected through the attrs', function () {
        scope.val = [1, 2, 3];
        element = angular.element('<lx-pager count="count" current-page="currentPage" page-sizes="{{ val }}" on-paging="getData(pagingOptions)"></lx-pager>');
        compile(element)(scope);
        scope.$digest();
        var elementScope = element.isolateScope();

        expect(elementScope.pageSizeOptions).toEqual([1, 2, 3, 10]);
    });

    it('should have a function skip() which returns the skip value', function () {
        var elementScope = element.isolateScope();
        expect(elementScope.skip()).toBe(0);

        elementScope.currentPage = 5;
        expect(elementScope.skip()).toBe(40);

        elementScope.pageSize = 1;
        expect(elementScope.skip()).toBe(4);
    });

    it('should have a function numberOfPages() which returns number of pages', function () {
        var elementScope = element.isolateScope();
        expect(elementScope.numberOfPages()).toBe(1);

        elementScope.count = 5;
        expect(elementScope.numberOfPages()).toBe(1);

        elementScope.pageSize = 0;
        expect(elementScope.numberOfPages()).toBe(5);
    });

    it('should should not match any if-else path in $observe for pageSizes', function () {
        element = angular.element('<lx-pager count="count" current-page="currentPage" ></lx-pager>');
        compile(element)(scope);
        var elementScope = element.isolateScope();
        elementScope.pageSizeOptions = {};
        scope.$digest();
    });

    it('should should not match the if path in $observe for pageSize with pageSize === "number"', function () {
        element = angular.element('<lx-pager count="count" page-size="5" current-page="currentPage" ></lx-pager>');
        compile(element)(scope);
        scope.$digest();
        var elementScope = element.isolateScope();
        expect(elementScope.pageSize).toBe(5);
    });

    it('should not trigger anything in scope.$watch(pageSize)', function () {
        element = angular.element('<lx-pager count="count" page-size="5" current-page="currentPage" ></lx-pager>');
        compile(element)(scope);
        scope.currentPage = 0;
        scope.pageSize = 5;
        scope.$digest();
    });

    it('should trigger if path in scope.$watch(pageSize)', function () {
        element = angular.element('<lx-pager count="count" page-size="5" current-page="currentPage" ></lx-pager>');
        compile(element)(scope);
        scope.currentPage = 1;
        scope.pageSize = 1;
        scope.count = 0;
        scope.$digest();
    });

    it('should have a function getOptions() which returns the paging options', function () {
        var elementScope = element.isolateScope();
        expect(elementScope.getOptions()).toEqual({limit: 10, skip: 0});

        elementScope.pageSize = 3;
        expect(elementScope.getOptions()).toEqual({limit: 3, skip: 0});

        elementScope.currentPage = 5;
        expect(elementScope.getOptions()).toEqual({limit: 3, skip: 12});
    });

    it('should have a function nextPage() which should page to the next page', function () {
        var elementScope = element.isolateScope();
        elementScope.nextPage();
        expect(elementScope.currentPage).toBe(1);

        elementScope.count = 50;
        elementScope.nextPage();

        expect(elementScope.currentPage).toBe(2);
    });

    it('should have a function previousPage() which should page to the previousPage page', function () {
        var elementScope = element.isolateScope();
        elementScope.previousPage();
        expect(elementScope.currentPage).toBe(1);

        elementScope.count = 50;
        elementScope.currentPage = 3;
        elementScope.previousPage();

        expect(elementScope.currentPage).toBe(2);
    });

    it('should have a function firstPage() which should page to the first page', function () {
        var elementScope = element.isolateScope();
        elementScope.firstPage();
        expect(elementScope.currentPage).toBe(1);

        elementScope.count = 50;
        elementScope.currentPage = 3;
        elementScope.firstPage();

        expect(elementScope.currentPage).toBe(1);
    });

    it('should have a function lastPage() which should page to the last page', function () {
        var elementScope = element.isolateScope();

        elementScope.lastPage();
        expect(elementScope.currentPage).toBe(1);

        elementScope.count = 50;
        elementScope.currentPage = 3;
        elementScope.lastPage();

        expect(elementScope.currentPage).toBe(5);
    });

    it('should change the number of pages', function () {
        var elementScope = element.isolateScope();

        expect(elementScope.currentPage).toBe(1);
        expect(elementScope.numberOfPages()).toBe(1);
        elementScope.count = 19;
        elementScope.$digest();

        expect(elementScope.currentPage).toBe(1);
        expect(elementScope.numberOfPages()).toBe(2);
        elementScope.currentPage = 5;
        expect(elementScope.currentPage).toBe(5);

        elementScope.count = 2;
        elementScope.$digest();

        expect(elementScope.currentPage).toBe(1);
    });

    it('should should initialize missing count', function () {
        element = angular.element('<lx-pager current-page="currentPage" ></lx-pager>');
        compile(element)(scope);
        var elementScope = element.isolateScope();
        expect(elementScope.count).toBe(0);
    });

    it('should set currentPage to default', function () {
        scope.count = 'ad';
        element = angular.element('<lx-pager count="count" current-page="currentPage" ></lx-pager>');
        compile(element)(scope);
        var elementScope = element.isolateScope();
        elementScope.lastPage();
        expect(elementScope.currentPage).toBe(1);
    });

    describe('has a function refresh() which', function () {
        it('should call the controller function', function () {
            var elementScope = element.isolateScope();
            var spy = scope.getData;
            elementScope.refresh();

            expect(spy).toHaveBeenCalled();
        });

        it('should refresh the data when the pageSize changes', function () {
            var elementScope = element.isolateScope();
            spyOn(elementScope, 'refresh');

            elementScope.currentPage = 1;
            elementScope.count = 14;
            elementScope.pageSize = 7;
            elementScope.$digest();

            expect(elementScope.refresh).toHaveBeenCalled();
            expect(elementScope.refresh.calls.count()).toEqual(1);
        });

        it('should do nothing the data when the pageSize changes with same value', function () {
            var elementScope = element.isolateScope();
            spyOn(elementScope, 'refresh');
            var spy = elementScope.refresh;
            elementScope.currentPage = 1;
            elementScope.count = 20;
            elementScope.pageSize = 10;
            elementScope.$digest();

            expect(spy).not.toHaveBeenCalled();
        });

        it('should refresh the data when the count changes', function () {
            var elementScope = element.isolateScope();
            spyOn(elementScope, 'refresh');
            var spy = elementScope.refresh;
            elementScope.currentPage = 99;
            elementScope.count = 20;
            elementScope.$digest();

            expect(elementScope.numberOfPages()).toBe(2);
            expect(elementScope.currentPage).toBe(2);
            expect(spy).toHaveBeenCalled();
            expect(spy.calls.count()).toEqual(2);
        });

        it('should not refresh the data when the count changes but the current page is smaller than the number of pages', function () {
            var elementScope = element.isolateScope();
            spyOn(elementScope, 'refresh');
            var spy = elementScope.refresh;
            elementScope.count = 7;

            expect(spy).not.toHaveBeenCalled();
            expect(spy.calls.count()).toEqual(0);
        });

        it('should refresh the data when the current page is changed', function () {
            element = angular.element('<lx-pager count="count" current-page="currentPage" on-paging="getData(pagingOptions)"></lx-pager>');
            compile(element)(scope);
            scope.$digest();

            var elementScope = element.isolateScope();
            spyOn(elementScope, 'refresh');
            scope.currentPage = 55;
            scope.$digest();

            expect(elementScope.refresh).toHaveBeenCalled();
            expect(elementScope.refresh.calls.count()).toEqual(1);
        });

        it('should not refresh the data when the current page is not a number', function () {
            element = angular.element('<lx-pager count="count" current-page="currentPage" on-paging="getData(pagingOptions)"></lx-pager>');
            compile(element)(scope);
            scope.$digest();

            var elementScope = element.isolateScope();
            spyOn(elementScope, 'refresh');
            var spy = elementScope.refresh;
            scope.currentPage = 'a';
            elementScope.$digest();

            expect(spy).not.toHaveBeenCalled();
            expect(spy.calls.count()).toEqual(0);
        });

        it('should not refresh the data when the current page is less than 0', function () {
            element = angular.element('<lx-pager count="count" current-page="currentPage" on-paging="getData(pagingOptions)"></lx-pager>');
            compile(element)(scope);
            scope.$digest();

            var elementScope = element.isolateScope();
            spyOn(elementScope, 'refresh');
            var spy = elementScope.refresh;
            scope.currentPage = -10;
            elementScope.$digest();

            expect(spy).not.toHaveBeenCalled();
            expect(spy.calls.count()).toEqual(0);
        });
    });
});
