'use strict';

describe('Controller: EditchapterCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var EditchapterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditchapterCtrl = $controller('EditchapterCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EditchapterCtrl.awesomeThings.length).toBe(3);
  });
});
