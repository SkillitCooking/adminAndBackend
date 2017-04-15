var service = {};

service.getRandomIndex = function(size) {
  return Math.random() * size << 0;
};

module.exports = service;