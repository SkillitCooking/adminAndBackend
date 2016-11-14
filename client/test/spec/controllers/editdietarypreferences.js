'use strict';

describe('Controller: EditdietarypreferencesCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var EditdietarypreferencesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditdietarypreferencesCtrl = $controller('EditdietarypreferencesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EditdietarypreferencesCtrl.awesomeThings.length).toBe(3);
  });
});
