'use strict';

describe('Service: seasoningService', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var seasoningService;
  beforeEach(inject(function (_seasoningService_) {
    seasoningService = _seasoningService_;
  }));

  it('should do something', function () {
    expect(!!seasoningService).toBe(true);
  });

});
