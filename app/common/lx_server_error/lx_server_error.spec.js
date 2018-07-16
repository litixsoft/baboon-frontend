'use strict';

describe('serverErrorTest', function () {
    var scope;

    beforeEach(module('common.servererror'));

    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();
        var element = angular.element('<form name="form"><input type="password" ng-model="model.password" name="password" lx-server-error /></form>');
        $compile(element)(scope);

        scope.model = {};
        scope.$digest();
    }));

    it('should clear the error message', function () {
        scope.form.password.$setValidity('server', false);
        scope.form.password.$error.serverMsg = 'TestError';
        scope.model.password = 'pass';
        scope.$digest();

        expect(scope.form.password.$error.serverMsg).toBeUndefined();
        expect(scope.form.password.$valid).toBe(true);
    });
});
