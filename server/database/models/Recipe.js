var mongoose = require('mongoose');
var SeasoningProfile = require('./SeasoningProfile');
var Dish = require('./Dish');
var StepTip = require('./StepTip');
var Ingredient = require('./Ingredient');

var ObjectId = mongoose.Schema.Types.ObjectId;

var StepSchema = new mongoose.Schema();
StepSchema.add({
  stepId: String,
  stepType: String,
  stepTip: StepTip.schema,
  stepInputs: {},
  productKeys: [String],
  stepSpecifics: [{
    propName: String,
    val: mongoose.Schema.Types.Mixed
  }],
  stepDuration: String,
  ingredientTypeName: String,
  auxiliarySteps: [StepSchema]
});

var IngredientTypeSchema = new mongoose.Schema({
  typeName: String,
  displayName: String,
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
  choiceSeasoningProfiles: [SeasoningProfile.schema],
  defaultServingSize: String,
  primaryIngredientType: String,
  mainPictureURL: String,
  mainVideoURL: String,
  manActiveTime: Number,
  manTotalTime: Number,
  prepTime: Number,
  totalTime: Number,
  hasBeenRecipeOfTheDay: Boolean,
  datesUsedAsRecipeOfTheDay: [Date],
  isRecipeOfTheDay: Boolean,
  collectionIds: [ObjectId]
});

module.exports.model = mongoose.model('Recipe', RecipeSchema);