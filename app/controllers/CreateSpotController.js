(function() {
	'use strict';	
	

	angular
		.module("SpotMate")
		.controller("CreateSpotController", [ '$scope', '$http', '$resource', CreateSpotController]);
	
	function CreateSpotController($scope, $http, $resource) {
		
		//init model
		$scope.spot = {
				locations: {}
		}
			
		// Any function returning a promise object can be used to load values asynchronously
		$scope.searchLocations = function(val) {
			return $resource("resources/locations/search/:query").get({query: val}).$promise.then(function(result) {
				return result._embedded.locations;						
			});							
		};
		  
		$scope.addLocation = function($model) {
			if ($model) {
				$scope.spot.locations[$model.id] = $model;
				$scope.selectLocation = null;
			}
		}
		
		$scope.removeLocation = function(location) {
			if (location) {
				delete($scope.spot.locations[location.id]);
			}
		}
		
		$scope.createSpot = function() {
			
			var spot = $scope.spot;
			
			if (spot && spot.name) {
				var spotDTO = {
						name: spot.name,
						locations: []
				}
				for (var key in spot.locations) {
					if (spot.locations.hasOwnProperty(key)) {
						spotDTO.locations.push(spot.locations[key]);
					}
				}
				$scope.promise = $resource("resources/spots").save(spotDTO); 											
			}
			
		}
	}

})();
