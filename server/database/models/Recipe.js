var mongoose = require('mongoose');
var SeasoningProfile = require('./SeasoningProfile');
var Dish = require('./Dish');
var StepTip = require('./StepTip');
var Ingredient = require('./Ingredient');

var StepSchema = new mongoose.Schema();
StepSchema.add({
  stepType: Number,
  stepTip: StepTip.schema,
  stepInputs: [{
    isDish: Boolean,
    isIngredient: Boolean,
    sourceType: String,
    sourceId: String,
    key: String
  }],
  productKeys: [String],
  stepModifiers: [{
    propName: String,
    val: String
  }],
  auxiliarySteps: [StepSchema]
});

var IngredientTypeSchema = new mongoose.Schema({
  typeName: String,
  ingredients: [Ingredient.schema],
  minNeeded: Number
});

var IngredientListSchema = new mongoose.Schema({
  ingredientTypes: [IngredientTypeSchema],
  equipmentNeeded: [Dish.schema]
});

var RecipeSchema = new mongoose.Schema({
  name: String,
  description: String,
  recipeType: Number,
  recipeCategory: Number,
  ingredientList: IngredientListSchema,
  stepList: [StepSchema],
  primaryCookingMethod: Number,
  otherCookingMethods: [Number],
  canAddSeasoningProfile: Boolean,
  defaultSeasoningProfile: SeasoningProfile.schema,
  primaryIngredientType: String
});

module.exports.model = mongoose.model('Recipe', RecipeSchema);