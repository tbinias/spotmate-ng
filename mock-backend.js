'use strict';

var jsonServer = require('json-server');

// Returns an Express server
var server = jsonServer.create();

// Set default middlewares (logger, static, cors and no-cache)
server.use(jsonServer.defaults);

// Returns an Express router
var router = jsonServer.router('db.json');
server.use(router);

/*
router.render = function (req, res) {
    if (req.url === '/internetschutzabschluss/Preis/') {
        res.jsonp(200, preisResponse(req.body));
    } else if (req.url === '/internetschutzabschluss/Postleitzahl/') {
        res.jsonp(200, postleitzahlResponse(req.body));
    } else if (req.url === '/internetschutzabschluss/') {
        console.log('processing antrag:');
        console.log(req.body);
        res.jsonp(200, antragResponse(req.body));
    } else {
	   res.jsonp(404, {});
    }
};*/

server.listen(3000, function () {
  console.log('JSON Server is running')
});
