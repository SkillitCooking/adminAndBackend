'use strict';

describe('Controller: EditglossaryentriesCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var EditglossaryentriesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditglossaryentriesCtrl = $controller('EditglossaryentriesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EditglossaryentriesCtrl.awesomeThings.length).toBe(3);
  });
});
