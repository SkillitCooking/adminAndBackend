var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var ChapterSchema = new mongoose.Schema({
  name: String,
  description: String,
  timeEstimate: String,
  LessonIds: [ObjectId]
});

module.exports.model = mongoose.model('Chapter', ChapterSchema);
module.exports.schema = ChapterSchema;