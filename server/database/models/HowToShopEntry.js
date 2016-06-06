var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var HowToShopEntrySchema = new mongoose.Schema({
  title: String,
  text: String,
  dateAdded: Date,
  dateModified: Date,
  pictures: [{
    url: String,
    caption: String
  }],
  collectionId: ObjectId
});

module.exports.model = mongoose.model('HowToShopEntry', HowToShopEntrySchema);
module.exports.schema = HowToShopEntrySchema;