'use strict';

describe('Controller: SeasoningprofilesCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var SeasoningprofilesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SeasoningprofilesCtrl = $controller('SeasoningprofilesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SeasoningprofilesCtrl.awesomeThings.length).toBe(3);
  });
});
