module.exports = Object.freeze({
  MIN_NUM_RECIPES_RETURN: 5,
  RECIPE_TYPES: {
    BYO: 'BYO',
    FULL: 'Full',
    ALACARTE: 'AlaCarte'
  },
  RECIPE_BADGES: {
    EASY_CLEANUP: 'easy_cleanup',
    GLUTEN_FREE: 'gluten_free',
    LEAN_PROTEIN: 'lean_protein',
    MINIMAL_PREP: 'minimal_prep',
    PALEO: 'paleo',
    PESCATARIAN: 'pescatarian',
    QUICK_EATS: 'quick_eats',
    REDUCETARIAN: 'reducetarian',
    VEGAN: 'vegan',
    VEGETARIAN: 'vegetarian',
    WELL_ROUNDED: 'well_rounded'
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
  RECIPE_CATEGORY_PAGE_SIZE: 3,
  MINIMUM_FULL_RECIPES_RETURN: 7,
  API_PASSWORD: {
    DEV: "MDm|C7oQQIm&AZyhx4g7m^+uNGqm$7Ctt2-60O&Ek-%0o!NuLT",
    PROD: "sm@34MLPG9L&rWph|YMwcg=&5|R3TMZ!!H+F48ThGFl56E&*RD"
  },
  PUSH_NOTIFICATIONS: {
    GENERAL: [
      'Yo NAME, you got dinner plans tonight? We\'re free (and a bit lonely).',
      'A home-cooked meal is nature\'s most powerful aphrodisiac. We\'re here to help. You can thank us later.'
    ],
    SUNDAYS: [
      'Get ready for the week wiht some meal prep. Guaranteed to make your Monday suck less.'
    ],
    INACTIVE: [
      'Hey NAME, haven\'t seen you in a while. Just want to make sure you aren\'t starving. Lots of new recipes to explore.'
    ]
  },
  TIMEZONES: {
    NO_TIMEZONE: 'NO_TIMEZONE',
    DEFAULT: 'America/Los_Angeles'
  },
  IONIC_API_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNTA4N2YxNS1hNDkzLTQ1ZWItODhjYi1mMmZlM2E4YzBlYWEifQ.kyVV756xmtyftjsFmjZDDSjNXpJ3fDRT6lMLUnirGwA'
});