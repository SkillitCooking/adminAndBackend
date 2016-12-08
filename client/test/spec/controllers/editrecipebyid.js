'use strict';

describe('Controller: EditrecipebyidCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var EditrecipebyidCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditrecipebyidCtrl = $controller('EditrecipebyidCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EditrecipebyidCtrl.awesomeThings.length).toBe(3);
  });
});
