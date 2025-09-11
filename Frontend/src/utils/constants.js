export const INDIAN_STATES = [
  { value: 'kerala', label: 'Kerala', labelMl: 'കേരളം' },
  { value: 'karnataka', label: 'Karnataka', labelMl: 'കർണാടക' },
  { value: 'tamil-nadu', label: 'Tamil Nadu', labelMl: 'തമിഴ്നാട്' },
  { value: 'andhra-pradesh', label: 'Andhra Pradesh', labelMl: 'ആന്ധ്രപ്രദേശ്' },
  { value: 'telangana', label: 'Telangana', labelMl: 'തെലങ്കാന' },
  { value: 'maharashtra', label: 'Maharashtra', labelMl: 'മഹാരാഷ്ട്ര' },
  { value: 'gujarat', label: 'Gujarat', labelMl: 'ഗുജറാത്ത്' },
  { value: 'rajasthan', label: 'Rajasthan', labelMl: 'രാജസ്ഥാൻ' },
  { value: 'punjab', label: 'Punjab', labelMl: 'പഞ്ചാബ്' },
  { value: 'haryana', label: 'Haryana', labelMl: 'ഹരിയാണ' },
  { value: 'uttar-pradesh', label: 'Uttar Pradesh', labelMl: 'ഉത്തർപ്രദേശ്' },
  { value: 'bihar', label: 'Bihar', labelMl: 'ബിഹാർ' },
  { value: 'west-bengal', label: 'West Bengal', labelMl: 'പശ്ചിമ ബംഗാൾ' },
  { value: 'odisha', label: 'Odisha', labelMl: 'ഒഡിഷ' },
  { value: 'madhya-pradesh', label: 'Madhya Pradesh', labelMl: 'മധ്യപ്രദേശ്' },
  { value: 'chhattisgarh', label: 'Chhattisgarh', labelMl: 'ഛത്തീസ്ഗഢ്' },
  { value: 'jharkhand', label: 'Jharkhand', labelMl: 'ഝാർഖണ്ഡ്' },
  { value: 'assam', label: 'Assam', labelMl: 'അസം' },
  { value: 'himachal-pradesh', label: 'Himachal Pradesh', labelMl: 'ഹിമാചൽപ്രദേശ്' },
  { value: 'uttarakhand', label: 'Uttarakhand', labelMl: 'ഉത്തരാഖണ്ഡ്' },
  { value: 'goa', label: 'Goa', labelMl: 'ഗോവ' },
  { value: 'manipur', label: 'Manipur', labelMl: 'മണിപ്പൂർ' },
  { value: 'meghalaya', label: 'Meghalaya', labelMl: 'മേഘാലയ' },
  { value: 'nagaland', label: 'Nagaland', labelMl: 'നാഗാലാൻഡ്' },
  { value: 'sikkim', label: 'Sikkim', labelMl: 'സിക്കിം' },
  { value: 'tripura', label: 'Tripura', labelMl: 'ത്രിപുര' },
  { value: 'arunachal-pradesh', label: 'Arunachal Pradesh', labelMl: 'അരുണാചൽപ്രദേശ്' },
  { value: 'mizoram', label: 'Mizoram', labelMl: 'മിസോറാം' },
]

export const INPUT_METHODS = {
  VOICE: 'voice',
  IMAGE: 'image',
  TEXT: 'text'
}

export const USER_TYPES = {
  FARMER: 'farmer',
  OFFICER: 'officer'
}

export const LANGUAGES = {
  ENGLISH: 'en',
  MALAYALAM: 'ml'
}

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
}

export const CROP_TYPES = [
  { value: 'rice', label: 'Rice', labelMl: 'നെല്ല്' },
  { value: 'wheat', label: 'Wheat', labelMl: 'ഗോതമ്പ്' },
  { value: 'maize', label: 'Maize', labelMl: 'ചോളം' },
  { value: 'sugarcane', label: 'Sugarcane', labelMl: 'കരിമ്പ്' },
  { value: 'cotton', label: 'Cotton', labelMl: 'പരുത്തി' },
  { value: 'tomato', label: 'Tomato', labelMl: 'തക്കാളി' },
  { value: 'potato', label: 'Potato', labelMl: 'ഉരുളക്കിഴങ്ങ്' },
  { value: 'onion', label: 'Onion', labelMl: 'ഉള്ളി' },
  { value: 'coconut', label: 'Coconut', labelMl: 'തേങ്ങ' },
  { value: 'banana', label: 'Banana', labelMl: 'വാഴ' },
]

export const WEATHER_CONDITIONS = {
  SUNNY: 'sunny',
  CLOUDY: 'cloudy',
  RAINY: 'rainy',
  STORMY: 'stormy',
  FOGGY: 'foggy'
}

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/user/profile'
  },
  QUERY: {
    SUBMIT: '/query',
    HISTORY: '/query/history',
    BY_ID: '/query'
  },
  ANALYSIS: {
    IMAGE: '/analyze-image',
    VOICE: '/voice/process'
  },
  DATA: {
    WEATHER: '/weather',
    RECOMMENDATIONS: '/recommendations',
    CROP_CALENDAR: '/crop-calendar',
    MARKET_PRICES: '/market-prices'
  }
}