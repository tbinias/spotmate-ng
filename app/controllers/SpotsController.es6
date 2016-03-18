'use strict';

import app from '../SpotMateApp.es6';

class SpotsController {

    constructor($rootScope, $scope, SpotService) {
		$rootScope.globalVM.promise = SpotService.findAll().then(function(spots) {
			$scope.spots = spots;
		});
	}

}

app.controller("SpotsController", [ '$rootScope', '$scope', 'SpotService', SpotsController]);
