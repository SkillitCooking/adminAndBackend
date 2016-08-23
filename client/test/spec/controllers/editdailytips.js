'use strict';

describe('Controller: EditdailytipsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var EditdailytipsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditdailytipsCtrl = $controller('EditdailytipsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EditdailytipsCtrl.awesomeThings.length).toBe(3);
  });
});
