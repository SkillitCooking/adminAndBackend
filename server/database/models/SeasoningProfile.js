var mongoose = require('mongoose');
var curUTCDate = require('../../util/dateLib').curUTCDate;

var SeasoningProfileSchema = new mongoose.Schema({
  name: String,
  recipeTitleAlias: String,
  spices: [String],
  dateCreated: {
    type: Date,
    default: curUTCDate
  },
  dateModified: {
    type: Date,
    default: curUTCDate
  }
});

module.exports.model = mongoose.model('SeasoningProfile', SeasoningProfileSchema);
module.exports.schema = SeasoningProfileSchema;