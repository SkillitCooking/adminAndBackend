var mongoose = require('mongoose');
var curUTCDate = require('../../util/dateLib').curUTCDate;

var ObjectId = mongoose.Schema.Types.ObjectId;

var DailyTipSchema = new mongoose.Schema({
  title: String,
  text: String,
  dateAdded: Date,
  dateModified: {
    type: Date,
    default: curUTCDate
  },
  dateCreated: {
    type: Date,
    default: curUTCDate
  },
  dateFeatured: Date,
  hasBeenDailyTip: Boolean,
  isTipOfTheDay: Boolean,
  picture: {
    url: String,
    caption: String
  },
  video: {
    url: String,
    caption: String,
    end: String,
    videoId: String
  },
  collectionIds: [ObjectId]
});

module.exports.model = mongoose.model('DailyTip', DailyTipSchema);
module.exports.schema = DailyTipSchema;