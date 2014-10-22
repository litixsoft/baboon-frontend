'use strict';

describe('Module: main.home', function () {

    // load the controller's module
    beforeEach(module('main'));

    var scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        $controller('HomeCtrl', {
            $scope: scope
        });
    }));

    it('should attach a vars to the scope', function () {
        expect(scope.app).toBe('main');
        expect(scope.view).toBe('home');
        expect(scope.controller).toBe('HomeCtrl');
    });
});
