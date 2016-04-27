/**
 * Top level for all routes
 */

module.exports = function (app) {

  //insert routes here - right now are sample routes
  app.use('/api/dishes', require('./routes/dishes'));
  app.use('/api/ingredients', require('./routes/ingredients'));
  app.use('/api/recipes', require('./routes/recipes'));
  app.use('/api/seasoningProfiles', require('./routes/seasoningProfiles'));

};
