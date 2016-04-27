'use strict';

describe('Controller: DishesCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var DishesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DishesCtrl = $controller('DishesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DishesCtrl.awesomeThings.length).toBe(3);
  });
});
