var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var DailyTipSchema = new mongoose.Schema({
  title: String,
  text: String,
  dateAdded: Date,
  dateModified: Date,
  dateFeatured: Date,
  hasBeenDailyTip: Boolean,
  picture: {
    url: String,
    caption: String
  },
  video: {
    url: String,
    caption: String
  },
  collectionId: ObjectId
});

module.exports.model = mongoose.model('DailyTip', DailyTipSchema);
module.exports.schema = DailyTipSchema;