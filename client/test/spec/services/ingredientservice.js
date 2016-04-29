'use strict';

describe('Service: ingredientService', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var ingredientService;
  beforeEach(inject(function (_ingredientService_) {
    ingredientService = _ingredientService_;
  }));

  it('should do something', function () {
    expect(!!ingredientService).toBe(true);
  });

});
