var mongoose = require('mongoose');
var curUTCDate = require('../../util/dateLib').curUTCDate;
var ObjectId = mongoose.Schema.Types.ObjectId;

var IngredientsUsedSchema = new mongoose.Schema({
  ingredientIds: [{
    _id: ObjectId,
    formIds: [ObjectId]
  }],
  isAnonymous: Boolean,
  userId: ObjectId,
  deviceToken: String,
  dateUsed: {
    type: Date,
    default: curUTCDate
  } 
});


module.exports.model = mongoose.model('IngredientsUsed', IngredientsUsedSchema);