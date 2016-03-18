'use strict';

import app from '../SpotMateApp.es6';

class EditSpotController {

    constructor($scope, $routeParams, SpotService) {

		console.log($routeParams);
		$scope.vm = {};

		$scope.vm.spot = SpotService.findById($routeParams.spotId).then(function(spot) {
			return spot;
		});
	}

}

app.controller("EditSpotController", ['$scope', '$routeParams', 'SpotService', EditSpotController]);
