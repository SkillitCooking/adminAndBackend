var mongoose = require('mongoose');
var curUTCDate = require('../../util/dateLib').curUTCDate;

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
  }
});

module.exports.model = mongoose.model('ItemCollection', ItemCollectionSchema);
module.exports.schema = ItemCollectionSchema;
