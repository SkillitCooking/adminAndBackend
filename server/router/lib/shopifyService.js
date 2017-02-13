var _ = require('lodash');
var constants = require('../../util/constants');

var service = {};

function getIngredientListHTML(recipe) {
  var htmlString = "";
  for (var i = recipe.ingredientList.ingredientTypes.length - 1; i >= 0; i--) {
    var type = recipe.ingredientList.ingredientTypes[i];
    for (var j = type.ingredients.length - 1; j >= 0; j--) {
      htmlString += '<li itemprop="recipeIngredient">';
      htmlString += type.ingredients[j].name.standardForm;
      htmlString += '</li>';
    }
  }
  htmlString += '<li itemprop="recipeIngredient">Oil or Butter</li>';
  return htmlString;
}

function getSeasoningsHTML(recipe) {
  var htmlString = "";
  var seasoning = recipe.defaultSeasoningProfile;
  for (var i = seasoning.spices.length - 1; i >= 0; i--) {
    htmlString += '<li itemprop="recipeIngredient">';
    htmlString += seasoning.spices[i];
    htmlString += '</li>';
  }
  return htmlString;
}

function getEquipmentListHTML(recipe) {
  var htmlString = "";
  for (var i = recipe.ingredientList.equipmentNeeded.length - 1; i >= 0; i--) {
    htmlString += '<li>' + recipe.ingredientList.equipmentNeeded[i].name + '</li>';
  }
  return htmlString;
}

function getStepListHTML(recipe) {
  //will need to import step machinery from client...
  //how to best package??
}

service.getShopifyDescription = function(recipe) {
  var htmlString = "";
  htmlString += '<div>';
  if(recipe.mainVideo || recipe.mainVideoURL) {
    var videoURL;
    if(recipe.mainVideo) {
      videoURL = "https://www.youtube.com/embed/" + recipe.mainVideo.videoId;
    } else if(recipe.mainVideoURL) {
      videoURL = recipe.mainVideoURL;
    }
    htmlString += '<div class="video-container">';
    htmlString += '<iframe width="560" height="315" src="';
    htmlString += videoURL + '" frameborder="0" allowfullscreen""</iframe>';
    htmlString += '</div>';
  }
  if(recipe.description) {
    htmlString += '<h2 itemprop="description">';
    htmlString += recipe.description;
    htmlString += '</h2>';
  }
  htmlString += '<p><b>Active Time: </b></p>';
  var contentPrepTime, prepTime;
  if(recipe.manActiveTime) {
    prepTime = recipe.manActiveTime;
    contentPrepTime = "PT" + recipe.manActiveTime + "M";
  } else {
    prepTime = recipe.prepTime;
    contentPrepTime = "PT" + recipe.prepTime + "M";
  }
  htmlString += '<meta itemprop="prepTime" content="' + contentPrepTime + '" />';
  htmlString += '<p>' + prepTime + ' mins </p>';
  htmlString += '<p><b>Total Time: </b></p>';
  var contentTotalTime, totalTime;
  if(recipe.manTotalTime) {
    totalTime = recipe.manTotalTime;
    contentTotalTime = "PT" + recipe.manTotalTime + "M";
  } else {
    totalTime = recipe.totalTime;
    contentTotalTime = "PT" + recipe.totalTime + "M";
  }
  htmlString += '<meta itemprop="cookTime" content="' + contentTotalTime + '" />';
  htmlString += '<p>' + totalTime + 'mins </p>';
  htmlString += '<p><b>Ingredients:</b></p>';
  htmlString += '<ul>';
  htmlString += getIngredientListHTML(recipe);
  htmlString += '</ul>';
  htmlString += '<p><b>Seasoning:</b></p>';
  htmlString += '<ul>';
  htmlString += getSeasoningsHTML(recipe);
  htmlString += '</ul>';
  htmlString += '<p><b>Equipment Needed</p></b>';
  htmlString += '<ul>';
  htmlString += getEquipmentListHTML(recipe);
  htmlString += '</ul>';
  htmlString += '<p itemprop="recipeInstructions">';
  htmlString += getStepListHTML(recipe);
  htmlString += '</p>';
  htmlString += '</div>';
  return htmlString;
};

module.exports = service;