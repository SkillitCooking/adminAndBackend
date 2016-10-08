var mongoose = require('mongoose');
var curUTCDate = require('../../util/dateLib').curUTCDate;

var ObjectId = mongoose.Schema.Types.ObjectId;

var ContentSectionSchema = new mongoose.Schema();
ContentSectionSchema.add({
  subTitle: String,
  contentArray: [mongoose.Schema.Types.Mixed]
  /*
  if type === 'text'
  --> props: textChunks
  textChunk props: text, linkedItem
  if type === 'video'
  --> props: videoId, end, caption
  if type === 'picture'
  --> url, caption
   */
});

var ArticleSchema = new mongoose.Schema({
  title: String,
  contentSections: [ContentSectionSchema],
  dateModified: {
    type: Date,
    default: curUTCDate
  },
  dateCreated: {
    type: Date,
    default: curUTCDate
  }
});

module.exports.model = mongoose.model('Article', ArticleSchema);
module.exports.schema = ArticleSchema;