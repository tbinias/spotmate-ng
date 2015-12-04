(function() {
	'use strict';
		
	angular
		.module("SpotMate")
		.controller("SpotController", ['$rootScope', '$scope', '$routeParams', '$location', 'SpotService', SpotController]);	
	
	
	function SpotController($rootScope, $scope, $routeParams, $location, SpotService) {
		
		$scope.vm={
				spot: null,
				location: null,
				routes: {
					edit: "#" + $location.path() + "/edit"
				},				
				windDirections: [],
				error: null
		};
				
		$rootScope.globalVM.promise = SpotService.findById($routeParams.spotId).then(function(spot) {
			$scope.vm.spot = spot;
			
			var windDirections = spot.windDirections;
			if (windDirections) {
				for (var i=0; i < windDirections.length; i++) {
					var windDir = windDirections[i];				
					$scope.vm.windDirections.push({
						value: windDir.start + ";" + windDir.end,							
						scoringFactor: windDir.scoringFactor								
					});
				}
			}

			$scope.vm.location = spot._embedded.locations[0];
		});

	};

})();