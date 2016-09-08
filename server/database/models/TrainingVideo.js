var mongoose = require('mongoose');
var curUTCDate = require('../../util/dateLib').curUTCDate;

var ObjectId = mongoose.Schema.Types.ObjectId;

var TrainingVideoSchema = new mongoose.Schema({
  title: String,
  dateAdded: {
    type: Date,
    default: curUTCDate
  },
  dateModified: {
    type: Date,
    default: curUTCDate
  },
  video: {
    url: String,
    caption: String
  },
  picture: {
    url: String,
    caption: String
  },
  collectionIds: [ObjectId]
});

module.exports.model = mongoose.model('TrainingVideo', TrainingVideoSchema);
module.exports.schema = TrainingVideoSchema;

