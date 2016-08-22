'use strict';

describe('Controller: EditarticlesCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var EditarticlesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditarticlesCtrl = $controller('EditarticlesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EditarticlesCtrl.awesomeThings.length).toBe(3);
  });
});
