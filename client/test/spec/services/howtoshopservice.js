'use strict';

describe('Service: howToShopService', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var howToShopService;
  beforeEach(inject(function (_howToShopService_) {
    howToShopService = _howToShopService_;
  }));

  it('should do something', function () {
    expect(!!howToShopService).toBe(true);
  });

});
