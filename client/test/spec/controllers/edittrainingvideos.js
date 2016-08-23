'use strict';

describe('Controller: EdittrainingvideosCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var EdittrainingvideosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EdittrainingvideosCtrl = $controller('EdittrainingvideosCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EdittrainingvideosCtrl.awesomeThings.length).toBe(3);
  });
});
