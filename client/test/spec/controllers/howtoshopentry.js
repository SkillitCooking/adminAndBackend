'use strict';

describe('Controller: HowtoshopentryCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var HowtoshopentryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HowtoshopentryCtrl = $controller('HowtoshopentryCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(HowtoshopentryCtrl.awesomeThings.length).toBe(3);
  });
});
