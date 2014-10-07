'use strict';

describe('Module: main.home.contact', function () {

  // load the controller's module
  beforeEach(module('main'));

  var ContactCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContactCtrl = $controller('ContactCtrl', {
      $scope: scope
    });
  }));

  it('should attach a vars to the scope', function () {
    expect(scope.app).toBe('main');
    expect(scope.view).toBe('contact');
    expect(scope.controller).toBe('ContactCtrl');
  });
});
