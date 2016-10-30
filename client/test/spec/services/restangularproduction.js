'use strict';

describe('Service: RestangularProductionService', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var restangularProductionService;
  beforeEach(inject(function (_RestangularProductionService_) {
    restangularProductionService = _RestangularProductionService_;
  }));

  it('should do something', function () {
    expect(!!restangularProductionService).toBe(true);
  });

});
