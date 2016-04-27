var mongoose = require('mongoose');

var SeasoningProfileSchema = new mongoose.Schema({
  name: String,
  spices: [String]
});

module.exports.model = mongoose.model('SeasoningProfile', SeasoningProfileSchema);
module.exports.schema = SeasoningProfileSchema;