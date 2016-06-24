'use strict';

describe('Controller: ItemcollectionsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ItemcollectionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ItemcollectionsCtrl = $controller('ItemcollectionsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ItemcollectionsCtrl.awesomeThings.length).toBe(3);
  });
});
