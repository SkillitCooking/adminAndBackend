var mongoose = require('mongoose');
var curUTCDate = require('../../util/dateLib').curUTCDate;

var RecipeTitleAdjectiveSchema = new mongoose.Schema({
  name: String,
  dateModified: {
    type: Date,
    default: curUTCDate
  },
  dateCreated: {
    type: Date,
    default: curUTCDate
  }
});

module.exports.model = mongoose.model('RecipeTitleAdjective', RecipeTitleAdjectiveSchema);
module.exports.schema = RecipeTitleAdjectiveSchema;