var mongoose = require('mongoose');
var Article = require('./Article');

var ObjectId = mongoose.Schema.Types.ObjectId;

var LessonSchema = new mongoose.Schema({
  name: String,
  timeEstimate: String,
  description: String,
  isArticle: Boolean,
  articleId: ObjectId,
  itemIds: {
    id: ObjectId,
    type: String
  }
});

module.exports.model = mongoose.model('Lesson', LessonSchema);
module.exports.schema = LessonSchema;