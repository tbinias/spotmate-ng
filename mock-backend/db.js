module.exports = function() {
  return {
    "resources": require('./resources.json'),
    "resources/locations": require('./locations.json'),
    "resources/locations/search/solingen": require("./locations/solingen.json"),
    "resources/accounts": require("./accounts.json"),
    "resources/spots": require("./spots.json"),
    "resources/spots/5/ranking": require("./spots/ranking-5.json"),
    "resources/spots/6/ranking": require("./spots/ranking-6.json"),
    "resources/spots/8/ranking": require("./spots/ranking-8.json"),
  }
}
