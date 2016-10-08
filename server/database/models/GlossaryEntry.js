var mongoose = require('mongoose');
var curUTCDate = require('../../util/dateLib').curUTCDate;

var ObjectId = mongoose.Schema.Types.ObjectId;

var GlossaryEntrySchema = new mongoose.Schema({
  title: String,
  text: String,
  dateAdded: {
    type: Date,
    default: curUTCDate
  },
  dateModified: {
    type: Date,
    default: curUTCDate
  },
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

module.exports.model = mongoose.model('GlossaryEntry', GlossaryEntrySchema);
module.exports.schema = GlossaryEntrySchema;