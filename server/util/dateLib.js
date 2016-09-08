var curUTCDate = function() {
  return Date.parse(new Date().toUTCString());
};

module.exports.curUTCDate = curUTCDate;