'use strict';

describe('Controller: DailytipsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var DailytipsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DailytipsCtrl = $controller('DailytipsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DailytipsCtrl.awesomeThings.length).toBe(3);
  });
});
