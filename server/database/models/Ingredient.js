var mongoose = require('mongoose');
var stepTip = require('./StepTip');
var curUTCDate = require('../../util/dateLib').curUTCDate;

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
  stepType: String,
  stepSubType: String,
  stepTip: stepTip.schema
});

var IngredientSchema = new mongoose.Schema({
  name: mongoose.Schema.Types.Mixed,
  inputCategory: String,
  inputSubCategory: String,
  units: String,
  unitIsASingleItem: Boolean,
  useFormNameForDisplay: Boolean,
  nameFormFlag: String,
  servingsPerUnit: Number,
  ingredientForms: [IngredientFormSchema],
  ingredientTips: [IngredientTipSchema],
  dateCreated: {
    type: Date,
    default: curUTCDate
  },
  dateModified: {
    type: Date,
    default: curUTCDate
  }
});

module.exports.model = mongoose.model('Ingredient', IngredientSchema);
module.exports.schema = IngredientSchema;