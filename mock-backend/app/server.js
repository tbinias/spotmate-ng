var express = require('express');
var app = express();

app.get('/resources', function(req, res) {
  res.json(require('./resources.json'));
});

app.get('/resources/accounts', function(req, res) {
  res.json(require('./accounts.json'));
});

app.get('/resources/locations', function(req, res) {
  res.json(require('./locations.json'));
});

app.get('/resources/locations/search/:location', function(req, res) {
  var location = req.params.location;
  res.json(require('./locations/' + location + '.json'));
});

app.get('/resources/spots', function(req, res) {
  res.json(require('./spots.json'));
});

app.get('/resources/spots/:id', function(req, res) {
  var id = req.params.id;
  res.json(require('./spots/' + id + '.json'));
});

app.get('/resources/spots/:id/ranking', function(req, res) {
  var id = req.params.id;
  res.json(require('./spots/ranking-' + id + '.json'));
});

app.get('/resources/forecasts/weather/:provider/:location', function(req, res) {
  var provider = req.params.provider;
  var location = req.params.location;
  res.json(require('./forecasts/weather/' + provider + '/' + location + '.json'));
});

app.get('/resources/forecasts/tide/:provider/:location', function(req, res) {
  var provider = req.params.provider;
  var location = req.params.location;
  res.json(require('./forecasts/tide/' + provider + '/' + location + '.json'));
});

app.listen(3000);
