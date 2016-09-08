var mongoose = require('mongoose');
var Article = require('./Article');
var curUTCDate = require('../../util/dateLib').curUTCDate;

var ObjectId = mongoose.Schema.Types.ObjectId;

var LessonSchema = new mongoose.Schema({
  name: String,
  timeEstimate: String,
  description: String,
  isArticle: Boolean,
  articleId: ObjectId,
  itemIds: [mongoose.Schema.Types.Mixed],
  dateCreated: {
    type: Date,
    default: curUTCDate
  },
  dateModified: {
    type: Date,
    default: curUTCDate
  }
});

module.exports.model = mongoose.model('Lesson', LessonSchema);
module.exports.schema = LessonSchema;