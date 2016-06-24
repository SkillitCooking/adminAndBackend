'use strict';

describe('Service: itemCollectionService', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var itemCollectionService;
  beforeEach(inject(function (_itemCollectionService_) {
    itemCollectionService = _itemCollectionService_;
  }));

  it('should do something', function () {
    expect(!!itemCollectionService).toBe(true);
  });

});
