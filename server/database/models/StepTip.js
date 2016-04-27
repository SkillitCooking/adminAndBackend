var mongoose = require('mongoose');

var StepTipSchema = new mongoose.Schema({
  title: String,
  text: String,
  pictureURL: String,
  videoURL: String,
  videoTitle: String
});

module.exports.model = mongoose.model('StepTip', StepTipSchema);
module.exports.schema = StepTipSchema;