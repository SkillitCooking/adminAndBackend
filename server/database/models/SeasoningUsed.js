var mongoose = require('mongoose');
var curUTCDate = require('../../util/dateLib').curUTCDate;
var ObjectId = mongoose.Schema.Types.ObjectId;

var SeasoningUsedSchema = new mongoose.Schema({
  seasoningId: ObjectId,
  mealCookedId: ObjectId,
  dateUsed: {
    type: Date,
    default: curUTCDate
  },
  isAnonymous: Boolean,
  userId: ObjectId,
  deviceToken: String
});

module.exports.model = mongoose.model('SeasoningUsed', SeasoningUsedSchema);