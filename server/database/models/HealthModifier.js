var mongoose = require('mongoose');
var curUTCDate = require('../../util/dateLib').curUTCDate;

var HealthModifierSchema = new mongoose.Schema({
  name: String,
  dateModified: {
    type: Date,
    default: curUTCDate
  },
  dateCreated: {
    type: Date,
    default: curUTCDate
  }
});

module.exports.model = mongoose.model('HealthModifier', HealthModifierSchema);
module.exports.schema = HealthModifierSchema;