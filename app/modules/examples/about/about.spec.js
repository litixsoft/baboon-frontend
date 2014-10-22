'use strict';

describe('Module: examples.about', function () {

    // load the controller's module
    beforeEach(module('examples'));

    var scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        $controller('AboutCtrl', {
            $scope: scope
        });
    }));

    it('should attach a vars to the scope', function () {
        expect(scope.app).toBe('examples');
        expect(scope.view).toBe('about');
        expect(scope.controller).toBe('AboutCtrl');
    });
});
