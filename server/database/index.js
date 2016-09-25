/**
 * Database interface
 */
var mongoose = require('mongoose');
var fs = require('fs');

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

// connections
// may need to change the devDB to a compose devDB...
// Maybe just use compose DB for both for now...
var devDB = 'mongodb://dane:ALDSJFljk345j2@aws-us-east-1-portal.16.dblayer.com:10285/skillit-dev-db?ssl=true';
var productionDB = 'mongodb://dane:ALDSJFljk345j2@aws-us-east-1-portal.16.dblayer.com:10285/skillit-dev-db?ssl=true';
var usedDB;
//ssl information
var ca = [fs.readFileSync('./ssl/sslca.pem')];
var o = {
  server: {
    ssl: true,
    sslCA: ca
  }
};

//if in development
if(process.env.NODE_ENV === 'development') {
  usedDB = devDB;
  mongoose.connect(usedDB, o);
}

//if in production
if(process.env.NODE_ENV === 'production') {
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