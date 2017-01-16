'use strict';

describe('Controller: EditrecipeadjectivesCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var EditrecipeadjectivesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditrecipeadjectivesCtrl = $controller('EditrecipeadjectivesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EditrecipeadjectivesCtrl.awesomeThings.length).toBe(3);
  });
});
