'use strict';

describe('Controller: EdititemcollectionsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var EdititemcollectionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EdititemcollectionsCtrl = $controller('EdititemcollectionsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EdititemcollectionsCtrl.awesomeThings.length).toBe(3);
  });
});
