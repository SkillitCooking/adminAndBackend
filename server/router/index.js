/**
 * Top level for all routes
 */

module.exports = function (app) {

  //insert routes here - right now are sample routes
  app.use('/api/dishes', require('./routes/dishes'));
  app.use('/api/ingredients', require('./routes/ingredients'));
  app.use('/api/recipes', require('./routes/recipes'));
  app.use('/api/seasoningProfiles', require('./routes/seasoningProfiles'));
  app.use('/api/dailyTips', require('./routes/dailyTips'));
  app.use('/api/glossaryEntries', require('./routes/glossaryEntries'));
  app.use('/api/howToShopEntries', require('./routes/howToShopEntries'));
  app.use('/api/itemCollections', require('./routes/itemCollections'));
  app.use('/api/trainingVideos', require('./routes/trainingVideos'));
  app.use('/api/clientLogging', require('./routes/clientLogging'));
};
