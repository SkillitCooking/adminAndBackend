'use strict';

describe('Controller: ViewallrecipesCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ViewallrecipesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewallrecipesCtrl = $controller('ViewallrecipesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ViewallrecipesCtrl.awesomeThings.length).toBe(3);
  });
});
