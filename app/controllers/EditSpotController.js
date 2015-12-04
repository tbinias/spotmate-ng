(function() {
	'use strict';
		
	angular
		.module("SpotMate")
		.controller("EditSpotController", ['$scope', '$routeParams', 'SpotService', EditSpotController]);	
	
	
	function EditSpotController($scope, $routeParams, SpotService) {
						
		console.log($routeParams);
		$scope.vm = {};
				
		$scope.vm.spot = SpotService.findById($routeParams.spotId).then(function(spot) {
			return spot;			
		});
	};

})();