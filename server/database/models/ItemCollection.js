var mongoose = require('mongoose');

var ItemCollectionSchema = new mongoose.Schema({
  name: String,
  itemType: String,
  description: String
});

module.exports.model = mongoose.model('ItemCollection', ItemCollectionSchema);
module.exports.schema = ItemCollectionSchema;
