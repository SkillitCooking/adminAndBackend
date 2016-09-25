var mongoose = require('mongoose');
var curUTCDate = require('../../util/dateLib').curUTCDate;

var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Schema.Types.Mixed;

var FavoriteRecipeSchema = new mongoose.Schema({
  recipeIds: [ObjectId],
  ingredientAndFormIds: [Mixed],
  ingredientNames: [String],
  userId: ObjectId,
  dateCreated: {
    type: Date,
    default: curUTCDate
  },
  datesUsed: [Date],
  dateLastUsed: {
    type: Date,
    default: curUTCDate
  },
  lastSeasoningProfileUsedId: ObjectId,
  name: String,
  mainPictureURL: String,
  prepTime: String,
  totalTime: String
});

module.exports.model = mongoose.model('FavoriteRecipe', FavoriteRecipeSchema);
module.exports.schema = FavoriteRecipeSchema;