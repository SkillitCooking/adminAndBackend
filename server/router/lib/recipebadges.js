var _ = require('lodash');
var constants = require('../../util/constants');

var service = {};

  function isEasyCleanup(recipe) {
    var dishes = _.reject(recipe.ingredientList.equipmentNeeded, function(dish) {
      return dish.name.toLowerCase() === 'default';
    });
    return dishes.length <= 2;
  }

  function isLeanProteinIngredient(ingredient) {
    //do forms come culled?
    var leanProteinNames = ['Eggs', 'Ahi Tuna', 'Chicken', 'Salmon', 'Cod (or any Whitefish)', 'Canned Fish'];
    for (var i = leanProteinNames.length - 1; i >= 0; i--) {
      if(leanProteinNames[i] === ingredient.name.standardForm) {
        return true;
      }
    }
    if(ingredient.name.standardForm === 'Ground Meat') {
      for (var i = ingredient.ingredientForms.length - 1; i >= 0; i--) {
        if(ingredient.ingredientForms[i].name === 'Beef' || ingredient.ingredientForms[i].name === 'Pork') {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  function isNotLeanProteinIngredient(ingredient) {
    var notLeanProteinNames = ['Lamb', 'Pork', 'Steak'];
    for (var i = notLeanProteinNames.length - 1; i >= 0; i--) {
      if(notLeanProteinNames[i] === ingredient.name.standardForm) {
        return true;
      }
    }
    if(ingredient.name.standardForm === 'Ground Meat') {
      for (var i = ingredient.ingredientForms.length - 1; i >= 0; i--) {
        if(ingredient.ingredientForms[i].name === 'Beef' || ingredient.ingredientForms[i].name === 'Pork') {
          return true;
        }
      }   
    }
    return false;
  }

  function isLeanProtein(recipe) {
    //flatten ingredientTypes.ingredients
    var leanProteins = [];
    var unLeanProteins = [];
    var ingredients = _.flatMap(recipe.ingredientList.ingredientTypes, function(type) {
      return type.ingredients;
    });
    //use _.some twice
    return _.some(ingredients, function(ingredient) {
      return isLeanProteinIngredient(ingredient);
    }) && !_.some(ingredients, function(ingredient) {
      return isNotLeanProteinIngredient(ingredient);
    });
  }

  function isMinimalPrep(recipe) {
    var prepTime;
    if(recipe.manActiveTime && recipe.manActiveTime !== '') {
      prepTime = recipe.manActiveTime;
    } else {
      prepTime = recipe.prepTime;
    }
    return prepTime <= 15;
  }

  function isPaleo(recipe) {
    //no potato, rice, quinoa, pasta
    for (var i = recipe.ingredientList.ingredientTypes.length - 1; i >= 0; i--) {
      for (var j = recipe.ingredientList.ingredientTypes[i].ingredients.length - 1; j >= 0; j--) {
        var ingredient = recipe.ingredientList.ingredientTypes[i].ingredients[j];
        if(ingredient.name.standardForm === 'Potatoes' || ingredient.name.standardForm === 'Pasta' || ingredient.name.standardForm === 'Quinoa' || ingredient.name.standardForm === 'Rice') {
          return false;
        }
      }
    }
    return true;
  }

  function isPescatarian(recipe) {
    var hasSeafood = false;
    for (var i = recipe.ingredientList.ingredientTypes.length - 1; i >= 0; i--) {
      var type = recipe.ingredientList.ingredientTypes[i];
      for (var j = type.ingredients.length - 1; j >= 0; j--) {
        var ingredientName = type.ingredients[j].name.standardForm;
        if(!hasSeafood && (ingredientName === 'Ahi Tuna' || ingredientName === 'Salmon' || ingredientName === 'Canned Fish' || ingredientName === 'Cod (or any Whitefish)')) {
          hasSeafood = true;
        }
        if(ingredientName ==='Chicken' || ingredientName === 'Steak' || ingredientName === 'Lamb' || ingredientName === 'Ground Meat' || ingredientName === 'Pork') {
          return false;
        }
      }
    }
    return hasSeafood;
  }

  function isQuickEats(recipe) {
    var totalTime;
    if(recipe.manTotalTime && recipe.manTotalTime !== '') {
      totalTime = recipe.manTotalTime;
    } else {
      totalTime = recipe.totalTime;
    }
    return totalTime <= 15;
  }

  function isReducetarian(recipe) {
    //uses ground meat or canned fish - not other meats
    var hasReduced = false;
    for (var i = recipe.ingredientList.ingredientTypes.length - 1; i >= 0; i--) {
      var type = recipe.ingredientList.ingredientTypes[i];
      for (var j = type.ingredients.length - 1; j >= 0; j--) {
        var ingredientName = type.ingredients[j].name.standardForm;
        if(!hasReduced && (ingredientName === 'Ground Meat' || ingredientName === 'Canned Fish')) {
          hasReduced = true;
        }
        if(ingredientName === 'Chicken' || ingredientName === 'Lamb' || ingredientName === 'Pork' || ingredientName === 'Steak' || ingredientName === 'Ahi Tuna' || ingredientName === 'Salmon' || ingredientName === 'Cod (or any Whitefish)') {
          return false;
        }
      }
    }
    return hasReduced;
  }

  function isVegan(recipe) {
    //no meat, seafood, or eggs
    var veganNoNos = ['Ahi Tuna', 'Salmon', 'Eggs', 'Ground Meat', 'Canned Fish', 'Cod (or any Whitefish)', 'Lamb', 'Chicken', 'Steak', 'Pork'];
    for (var i = recipe.ingredientList.ingredientTypes.length - 1; i >= 0; i--) {
      var type = recipe.ingredientList.ingredientTypes[i];
      for (var j = type.ingredients.length - 1; j >= 0; j--) {
        var ingredientName = type.ingredients[j].name.standardForm;
        for (var k = veganNoNos.length - 1; k >= 0; k--) {
          if(veganNoNos[k] === ingredientName) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function isVegetarian(recipe) {
    //no meat or seafood
    var vegetarianNoNos = ['Ahi Tuna', 'Salmon', 'Ground Meat', 'Canned Fish', 'Cod (or any Whitefish)', 'Lamb', 'Chicken', 'Steak', 'Pork'];
    for (var i = recipe.ingredientList.ingredientTypes.length - 1; i >= 0; i--) {
      var type = recipe.ingredientList.ingredientTypes[i];
      for (var j = type.ingredients.length - 1; j >= 0; j--) {
        var ingredientName = type.ingredients[j].name.standardForm;
        for (var k = vegetarianNoNos.length - 1; k >= 0; k--) {
          if(vegetarianNoNos[k] === ingredientName) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function isWellRounded(recipe) {
    //uses at least one of each: Veggie, Starch, Protein
    var hasVeggie, hasStarch, hasProtein = false;
    for (var i = recipe.ingredientList.ingredientTypes.length - 1; i >= 0; i--) {
      var type = recipe.ingredientList.ingredientTypes[i];
      for (var j = type.ingredients.length - 1; j >= 0; j--) {
        var ingredient = type.ingredients[j];
        if(ingredient.inputCategory === 'Protein') {
          hasProtein = true;
        }
        if(ingredient.inputCategory === 'Vegetables') {
          hasVeggie = true;
        }
        if(ingredient.inputCategory === 'Starches') {
          hasStarch = true;
        }
      }
    }
    return hasVeggie && hasStarch && hasProtein;
  }

  function isGlutenFree(recipe) {
    for (var i = recipe.ingredientList.ingredientTypes.length - 1; i >= 0; i--) {
      var type = recipe.ingredientList.ingredientTypes[i];
      for (var j = type.ingredients.length - 1; j >= 0; j--) {
        var ingredient = type.ingredients[j];
        if(ingredient.name.standardForm === 'Pasta') {
          return false;
        }
      }
    }
    return true;
  }

  service.getBadgesForRecipe = function(recipe) {
    var badges = [];
    /*if(isEasyCleanup(recipe)) {
      badges.push(constants.RECIPE_BADGES.EASY_CLEANUP);
    }*/
    if(isGlutenFree(recipe)) {
      badges.push(constants.RECIPE_BADGES.GLUTEN_FREE);
    }
    if(isLeanProtein(recipe)) {
      badges.push(constants.RECIPE_BADGES.LEAN_PROTEIN);
    }
    /*if(isMinimalPrep(recipe)) {
      badges.push(constants.RECIPE_BADGES.MINIMAL_PREP);
    }*/
    if (isPaleo(recipe)) {
      badges.push(constants.RECIPE_BADGES.PALEO);
    }
    if(isPescatarian(recipe)) {
      badges.push(constants.RECIPE_BADGES.PESCATARIAN);
    }
    if(isQuickEats(recipe)) {
      badges.push(constants.RECIPE_BADGES.QUICK_EATS);
    }
    /*if(isReducetarian(recipe)) {
      badges.push(constants.RECIPE_BADGES.REDUCETARIAN);
    }*/
    if(isVegan(recipe)) {
      badges.push(constants.RECIPE_BADGES.VEGAN);
    }
    if(isVegetarian(recipe)) {
      badges.push(constants.RECIPE_BADGES.VEGETARIAN);
    }
    /*if(isWellRounded(recipe)) {
      badges.push(constants.RECIPE_BADGES.WELL_ROUNDED);
    }*/
    return badges;
  };

module.exports = service;