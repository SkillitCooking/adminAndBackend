/**
 * Top level for all routes
 */

var constants = require('../util/constants');
var logger = require('../util/logger').serverLogger;

module.exports = function (app) {

  app.use('/api/dishes', require('./routes/dishes'));
  app.use('/api/ingredients', require('./routes/ingredients'));
  app.use('/api/recipes', require('./routes/recipes'));
  app.use('/api/seasoningProfiles', require('./routes/seasoningProfiles'));
  app.use('/api/dailyTips', require('./routes/dailyTips'));
  app.use('/api/glossaryEntries', require('./routes/glossaryEntries'));
  app.use('/api/howToShopEntries', require('./routes/howToShopEntries'));
  app.use('/api/contentItems', require('./routes/contentItems'));
  app.use('/api/itemCollections', require('./routes/itemCollections'));
  app.use('/api/trainingVideos', require('./routes/trainingVideos'));
  app.use('/api/articles', require('./routes/articles'));
  app.use('/api/lessons', require('./routes/lessons'));
  app.use('/api/chapters', require('./routes/chapters'));
  app.use('/api/users', require('./routes/users'));
  app.use('/api/favoriteRecipes', require('./routes/favoriteRecipes'));
  app.use('/api/dietaryPreferences', require('./routes/dietaryPreferences'));
  app.use('/api/ingredientsUsed', require('./routes/ingredientsUsed'));
  app.use('/api/mealsCooked', require('./routes/mealsCooked'));
  app.use('/api/seasoningUsed', require('./routes/seasoningUsed'));
  app.use('/api/clientLogging', require('./routes/clientLogging'));
};
