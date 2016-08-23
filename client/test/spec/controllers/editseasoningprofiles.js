'use strict';

describe('Controller: EditseasoningprofilesCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var EditseasoningprofilesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditseasoningprofilesCtrl = $controller('EditseasoningprofilesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EditseasoningprofilesCtrl.awesomeThings.length).toBe(3);
  });
});
