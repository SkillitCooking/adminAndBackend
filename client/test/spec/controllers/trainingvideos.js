'use strict';

describe('Controller: TrainingvideosCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var TrainingvideosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TrainingvideosCtrl = $controller('TrainingvideosCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TrainingvideosCtrl.awesomeThings.length).toBe(3);
  });
});
