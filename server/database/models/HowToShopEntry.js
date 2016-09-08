var mongoose = require('mongoose');
var curUTCDate = require('../../util/dateLib').curUTCDate;

var ObjectId = mongoose.Schema.Types.ObjectId;

var HowToShopEntrySchema = new mongoose.Schema({
  title: String,
  text: String,
  dateAdded: {
    type: Date,
    default: curUTCDate
  },
  dateModified: {
    type: Date,
    default: curUTCDate
  },
  pictures: [{
    url: String,
    caption: String
  }],
  collectionIds: [ObjectId]
});

module.exports.model = mongoose.model('HowToShopEntry', HowToShopEntrySchema);
module.exports.schema = HowToShopEntrySchema;