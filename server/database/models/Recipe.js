var mongoose = require('mongoose');
var SeasoningProfile = require('./SeasoningProfile');
var Dish = require('./Dish');
var StepTip = require('./StepTip');
var Ingredient = require('./Ingredient');

var StepSchema = new mongoose.Schema();
StepSchema.add({
  stepId: String,
  stepType: String,
  stepTip: StepTip.schema,
  stepInputs: [{
    isDish: Boolean,
    isIngredient: Boolean,
    sourceType: String,
    sourceId: String,
    key: String,
    inputName: String
  }],
  productKeys: [String],
  stepModifiers: [{
    propName: String,
    val: String
  }],
  stepDuration: String,
  auxiliarySteps: [StepSchema]
});

var IngredientTypeSchema = new mongoose.Schema({
  typeName: String,
  ingredients: [Ingredient.schema],
  minNeeded: String
});

var IngredientListSchema = new mongoose.Schema({
  ingredientTypes: [IngredientTypeSchema],
  equipmentNeeded: [Dish.schema]
});

var RecipeSchema = new mongoose.Schema({
  name: String,
  description: String,
  recipeType: String,
  recipeCategory: String,
  ingredientList: IngredientListSchema,
  stepList: [StepSchema],
  primaryCookingMethod: String,
  otherCookingMethods: [String],
  canAddSeasoningProfile: Boolean,
  defaultSeasoningProfile: SeasoningProfile.schema,
  primaryIngredientType: String,
  mainPictureURL: String
});

module.exports.model = mongoose.model('Recipe', RecipeSchema);