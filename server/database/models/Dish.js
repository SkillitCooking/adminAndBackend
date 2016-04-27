var mongoose = require('mongoose');

var DishSchema = new mongoose.Schema({
  name: String,
  ingredientCapacity: String
});

module.exports.model = mongoose.model('Dish', DishSchema);
module.exports.schema = DishSchema;