'use strict';

describe('Controller: HealthmodifiersCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var HealthmodifiersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HealthmodifiersCtrl = $controller('HealthmodifiersCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(HealthmodifiersCtrl.awesomeThings.length).toBe(3);
  });
});
