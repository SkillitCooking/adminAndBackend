var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var ContentSectionSchema = new mongoose.Schema();
ContentSectionSchema.add({
  subTitle: String,
  contentArray: [mongoose.Schema.Types.Mixed]
});

var ArticleSchema = new mongoose.Schema({
  title: String,
  contentSections: [ContentSectionSchema]
});

module.exports.model = mongoose.model('Article', ArticleSchema);
module.exports.schema = ArticleSchema;