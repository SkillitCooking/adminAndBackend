var mongoose = require('mongoose');
var curUTCDate = require('../../util/dateLib').curUTCDate;

var ObjectId = mongoose.Schema.Types.ObjectId;

var ChapterSchema = new mongoose.Schema({
  name: String,
  description: String,
  timeEstimate: String,
  lessonIds: [ObjectId],
  dateModified: {
    type: Date,
    default: curUTCDate
  },
  dateCreated: {
    type: Date,
    default: curUTCDate
  }
});

module.exports.model = mongoose.model('Chapter', ChapterSchema);
module.exports.schema = ChapterSchema;