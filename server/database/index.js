/**
 * Database interface
 */
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');

//models
var dishes = require('./models/Dish.js');
var ingredients = require('./models/Ingredient.js');
var recipes = require('./models/Recipe.js');
var seasoningProfiles = require('./models/SeasoningProfile.js');
var dailyTips = require('./models/DailyTip.js');
var glossaryEntries = require('./models/GlossaryEntry.js');
var howToShopEntries = require('./models/HowToShopEntry.js');
var itemCollections = require('./models/ItemCollection.js');
var trainingVideos = require('./models/TrainingVideo.js');
var articles = require('./models/Article.js');
var lessons = require('./models/Lesson.js');
var chapters = require('./models/Chapter.js');
var users = require('./models/User.js');
var favoriteRecipes = require('./models/FavoriteRecipe.js');
var dietaryPreferences = require('./models/DietaryPreference.js');
var mealsCooked = require('./models/MealsCooked.js');
var ingredientsUsed = require('./models/IngredientsUsed.js');
var seasoningUsed = require('./models/SeasoningUsed.js');

// connections
// may need to change the devDB to a compose devDB...
// Maybe just use compose DB for both for now...
var devDB = 'mongodb://dane:ALDSJFljk345j2@aws-us-east-1-portal.17.dblayer.com:15427/skillit-dev-db?ssl=true';
var productionDB = 'mongodb://dane:ALDSJFljk345j2@aws-us-west-2-portal.0.dblayer.com:15198/skillit-prod-db?ssl=true';
var usedDB;

//if in development
if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging') {
  //ssl information
  var devCa = [fs.readFileSync(path.resolve(path.join(__dirname, 'ssl', 'devca.pem')))];
  var devO = {
    server: {
      ssl: true,
      sslCA: devCa
    }
  };
  usedDB = devDB;
  mongoose.connect(usedDB, devO);
}

//if in production
if(process.env.NODE_ENV === 'production') {
  //ssl information
  var ca = [fs.readFileSync(path.resolve(path.join(__dirname, 'ssl', 'prodca.pem')))];
  var o = {
    server: {
      ssl: true,
      sslCA: ca
    }
  };
  usedDB = productionDB;
  mongoose.connect(usedDB, o);
}

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {
  console.log('Database connection successfully opened at ' + usedDB);
});


exports.dishes = dishes;
exports.ingredients = ingredients;
exports.recipes = recipes;
exports.seasoningProfiles = seasoningProfiles;
exports.dailyTips = dailyTips;
exports.glossaryEntries = glossaryEntries;
exports.howToShopEntries = howToShopEntries;
exports.itemCollections = itemCollections;
exports.trainingVideos = trainingVideos;
exports.articles = articles;
exports.lessons = lessons;
exports.chapters = chapters;
exports.users = users;
exports.favoriteRecipes = favoriteRecipes;
exports.dietaryPreferences = dietaryPreferences;
exports.mealsCooked = mealsCooked;
exports.ingredientsUsed = ingredientsUsed;
exports.seasoningUsed = seasoningUsed;