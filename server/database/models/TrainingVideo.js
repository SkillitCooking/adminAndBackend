var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var TrainingVideoSchema = new mongoose.Schema({
  title: String,
  dateAdded: Date,
  dateModified: Date,
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

