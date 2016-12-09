module.exports = Object.freeze({
  MIN_NUM_RECIPES_RETURN: 5,
  RECIPE_TYPES: {
    BYO: 'BYO',
    FULL: 'Full',
    ALACARTE: 'AlaCarte'
  },
  ITEM_TYPES: {
    TIP: 'tip',
    GLOSSARY: 'glossary',
    HOWTOSHOP: 'howToShop',
    TRAININGVIDEO: 'trainingVideo'
  },
  SIGN_IN_SOURCES: {
    FACEBOOK: 'facebook',
    GOOGLE: 'google',
    EMAIL: 'email'
  },
  STATUS_CODES: {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    UNPROCESSABLE: 422
  },
  RECIPES_PER_PAGE: 10,
  RECIPE_CATEGORY_PAGE_SIZE: 5,
  MINIMUM_FULL_RECIPES_RETURN: 7,
  API_PASSWORD: {
    DEV: "MDm|C7oQQIm&AZyhx4g7m^+uNGqm$7Ctt2-60O&Ek-%0o!NuLT",
    PROD: "sm@34MLPG9L&rWph|YMwcg=&5|R3TMZ!!H+F48ThGFl56E&*RD"
  }
});