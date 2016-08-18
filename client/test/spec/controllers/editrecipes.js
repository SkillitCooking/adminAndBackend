'use strict';

describe('Controller: EditrecipesCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var EditrecipesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditrecipesCtrl = $controller('EditrecipesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EditrecipesCtrl.awesomeThings.length).toBe(3);
  });
});
