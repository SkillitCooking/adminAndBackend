'use strict';

describe('Controller: GlossaryentriesCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var GlossaryentriesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GlossaryentriesCtrl = $controller('GlossaryentriesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(GlossaryentriesCtrl.awesomeThings.length).toBe(3);
  });
});
