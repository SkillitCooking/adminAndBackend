'use strict';

describe('Controller: RecipeadjectivesCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var RecipeadjectivesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecipeadjectivesCtrl = $controller('RecipeadjectivesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecipeadjectivesCtrl.awesomeThings.length).toBe(3);
  });
});
