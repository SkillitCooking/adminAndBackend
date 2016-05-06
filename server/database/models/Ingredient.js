var mongoose = require('mongoose');
var stepTip = require('./StepTip');

var CookingTimeSchema = new mongoose.Schema({
  cookingMethod: String,
  minTime: Number,
  maxTime: Number,
  timesArePerSide: Boolean
});

var IngredientFormSchema = new mongoose.Schema({
  name: String,
  cookingTimes: [CookingTimeSchema]
});

var IngredientTipSchema = new mongoose.Schema({
  stepType: Number,
  stepSubType: String,
  stepTip: {
    title: String,
    text: String,
    pictureURL: String,
    videoURL: String,
    videoTitle: String
  }
});

var IngredientSchema = new mongoose.Schema({
  name: String,
  inputCategory: String,
  ingredientForms: [IngredientFormSchema],
  ingredientTips: [IngredientTipSchema]
});

module.exports.model = mongoose.model('Ingredient', IngredientSchema);
module.exports.schema = IngredientSchema;