'use strict';

describe('Controller: EdithowtoshopentriesCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var EdithowtoshopentriesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EdithowtoshopentriesCtrl = $controller('EdithowtoshopentriesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EdithowtoshopentriesCtrl.awesomeThings.length).toBe(3);
  });
});
