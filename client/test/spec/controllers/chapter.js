'use strict';

describe('Controller: ChapterCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ChapterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChapterCtrl = $controller('ChapterCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ChapterCtrl.awesomeThings.length).toBe(3);
  });
});
