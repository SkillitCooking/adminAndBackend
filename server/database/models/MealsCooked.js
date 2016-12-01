var mongoose = require('mongoose');
var curUTCDate = require('../../util/dateLib').curUTCDate;
var ObjectId = mongoose.Schema.Types.ObjectId;

var MealsCookedSchema = new mongoose.Schema({
  recipeIds: [ObjectId],
  source: {
    type: Number,
    min: [0, 'The value of "{PATH}" ({VALUE}) is not an allowable value'],
    max: [2, 'The value of "{PATH}" ({VALUE}) is not an allowable value']
  },
  isAnonymous: Boolean,
  userId: ObjectId,
  ingredientsChosenIds: [{
    _id: ObjectId,
    formIds: [ObjectId]
  }],
  deviceToken: String,
  dateCooked: {
    type: Date,
    default: curUTCDate
  }
});

module.exports.model = mongoose.model('MealsCooked', MealsCookedSchema);