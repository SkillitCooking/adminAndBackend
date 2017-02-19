var mongoose = require('mongoose');
var SeasoningProfile = require('./SeasoningProfile');
var Dish = require('./Dish');
var StepTip = require('./StepTip');
var Ingredient = require('./Ingredient');
var HealthModifier = require('./HealthModifier');
var RecipeTitleAdjective = require('./RecipeTitleAdjective');
var curUTCDate = require('../../util/dateLib').curUTCDate;

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
  stepComposition: mongoose.Schema.Types.Mixed,
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
  nameBodies: mongoose.Schema.Types.Mixed,
  description: String,
  conditionalDescriptions: mongoose.Schema.Types.Mixed,
  allowablePrefixIds: [ObjectId],
  recipeType: String,
  badges: [String],
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
  mainPictureURLs: [String],
  mainVideoURL: String,
  mainVideo: {
    end: String,
    videoId: String
  },
  manActiveTime: Number,
  manTotalTime: Number,
  prepTime: Number,
  totalTime: Number,
  hasBeenRecipeOfTheDay: Boolean,
  datesUsedAsRecipeOfTheDay: [Date],
  isRecipeOfTheDay: Boolean,
  collectionIds: [ObjectId],
  dateCreated: {
    type: Date,
    default: curUTCDate
  },
  dateModified: {
    type: Date,
    default: curUTCDate
  },
  healthModifiers: [HealthModifier.schema],
  titleAdjectives: [RecipeTitleAdjective.schema],
  compatibilityVersion: {
    type: Number,
    default: 1
  }
});

module.exports.model = mongoose.model('Recipe', RecipeSchema);