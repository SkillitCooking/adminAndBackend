'use strict';

describe('Service: compatibilityService', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var compatibilityService;
  beforeEach(inject(function (_compatibilityService_) {
    compatibilityService = _compatibilityService_;
  }));

  it('should do something', function () {
    expect(!!compatibilityService).toBe(true);
  });

});
