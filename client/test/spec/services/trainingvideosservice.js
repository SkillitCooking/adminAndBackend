'use strict';

describe('Service: trainingVideosService', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var trainingVideosService;
  beforeEach(inject(function (_trainingVideosService_) {
    trainingVideosService = _trainingVideosService_;
  }));

  it('should do something', function () {
    expect(!!trainingVideosService).toBe(true);
  });

});
