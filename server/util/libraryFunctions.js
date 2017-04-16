var service = {};

service.getRandomIndex = function(size) {
  return Math.random() * size << 0;
};

service.isEmpty = function(obj) {
  for(var key in obj) {
      return false;
    }
    return true;
};

module.exports = service;