var mongoose = require('mongoose');
var curUTCDate = require('../../util/dateLib').curUTCDate;

var ObjectId = mongoose.Schema.Types.ObjectId;

var DietaryPreferenceSchema = new mongoose.Schema({
  title: String,
  outlawIngredients: [String],
  dateCreated: {
    type: Date,
    default: curUTCDate
  },
  dateModified: {
    type: Date,
    default: curUTCDate
  }
});

module.exports.model = mongoose.model('DietaryPreference', DietaryPreferenceSchema);
module.exports.schema = DietaryPreferenceSchema;