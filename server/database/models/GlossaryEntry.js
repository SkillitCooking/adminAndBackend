var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var GlossaryEntrySchema = new mongoose.Schema({
  title: String,
  text: String,
  dateAdded: Date,
  dateModified: Date,
  picture: {
    url: String,
    caption: String
  },
  video: {
    url: String,
    caption: String
  },
  collectionId: ObjectId
});

module.exports.model = mongoose.model('GlossaryEntry', GlossaryEntrySchema);
module.exports.schema = GlossaryEntrySchema;