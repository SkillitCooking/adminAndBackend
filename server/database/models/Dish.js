var mongoose = require('mongoose');
var curUTCDate = require('../../util/dateLib').curUTCDate;

var DishSchema = new mongoose.Schema({
  name: String,
  ingredientCapacity: String,
  dateModified: {
    type: Date,
    default: curUTCDate
  },
  dateCreated: {
    type: Date,
    default: curUTCDate
  }
});

module.exports.model = mongoose.model('Dish', DishSchema);
module.exports.schema = DishSchema;