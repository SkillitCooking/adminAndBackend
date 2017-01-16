'use strict';

describe('Controller: EdithealthmodifiersCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var EdithealthmodifiersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EdithealthmodifiersCtrl = $controller('EdithealthmodifiersCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EdithealthmodifiersCtrl.awesomeThings.length).toBe(3);
  });
});
