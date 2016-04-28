'use strict';

describe('Service: dishService', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var dishService;
  beforeEach(inject(function (_dishService_) {
    dishService = _dishService_;
  }));

  it('should do something', function () {
    expect(!!dishService).toBe(true);
  });

});
