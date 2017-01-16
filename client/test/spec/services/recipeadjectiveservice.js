'use strict';

describe('Service: recipeAdjectiveService', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var recipeAdjectiveService;
  beforeEach(inject(function (_recipeAdjectiveService_) {
    recipeAdjectiveService = _recipeAdjectiveService_;
  }));

  it('should do something', function () {
    expect(!!recipeAdjectiveService).toBe(true);
  });

});
