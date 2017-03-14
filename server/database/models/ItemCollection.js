var mongoose = require('mongoose');
var curUTCDate = require('../../util/dateLib').curUTCDate;

var ObjectId = mongoose.Schema.Types.ObjectId;

var ItemCollectionSchema = new mongoose.Schema({
  name: String,
  itemType: String,
  description: String,
  dateCreated: {
    type: Date,
    default: curUTCDate
  },
  dateModified: {
    type: Date,
    default: curUTCDate
  },
  pictureURLs: [String],
  orderPreference: Number,
  isBYOCollection: Boolean,
  dietaryPreferenceIds: [ObjectId]
});

module.exports.model = mongoose.model('ItemCollection', ItemCollectionSchema);
module.exports.schema = ItemCollectionSchema;
